import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import prisma from '../utils/db.js';
import { generateTokens } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: 'user'
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    console.log('🔐 Login attempt:', {
      username: req.body.username,
      hasPassword: !!req.body.password,
      passwordLength: req.body.password?.length
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    console.log('🔍 Searching for user:', username);

    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      console.log('❌ User not found:', username);
      // Also check if any users exist at all
      const userCount = await prisma.user.count();
      console.log('ℹ️  Total users in database:', userCount);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ User found:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      hasPasswordHash: !!user.passwordHash,
      passwordHashLength: user.passwordHash?.length
    });

    // Verify password
    console.log('🔑 Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    console.log('🔑 Password comparison result:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Password mismatch for user:', username);
      // For debugging: try to see what the stored hash looks like (first 20 chars only)
      console.log('ℹ️  Stored hash preview:', user.passwordHash?.substring(0, 20) + '...');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Password verified successfully');

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    console.log('✅ Tokens generated for user:', username);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Error stack:', error.stack);
    next(error);
  }
};

export const logout = async (req, res) => {
  // With JWT, logout is handled client-side by removing tokens
  // In a production app, you might want to maintain a token blacklist
  res.json({ message: 'Logout successful' });
};

export const getMe = async (req, res) => {
  res.json({
    user: req.user
  });
};

export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

