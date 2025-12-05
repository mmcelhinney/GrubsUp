import prisma from '../utils/db.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            images: true,
            savedRecipes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
};

export const getLogs = async (req, res, next) => {
  try {
    // In a production app, you'd have a proper logging system
    // For now, return basic stats
    const stats = {
      totalUsers: await prisma.user.count(),
      totalImages: await prisma.image.count(),
      totalRecipes: await prisma.recipe.count(),
      totalIngredients: await prisma.ingredient.count(),
      recentImages: await prisma.image.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              username: true,
              email: true
            }
          }
        }
      })
    };

    res.json({ logs: stats });
  } catch (error) {
    next(error);
  }
};

