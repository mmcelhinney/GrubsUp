import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔄 Creating admin user...');

    // Check if admin already exists
    const adminExists = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (adminExists) {
      console.log('ℹ️  Admin user already exists');
      console.log(`   Username: ${adminExists.username}`);
      console.log(`   Email: ${adminExists.email}`);
      console.log(`   Role: ${adminExists.role}`);
      await prisma.$disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@dinnersready.com',
        passwordHash: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n⚠️  Remember to change the password in production!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    if (error.code === 'P2002') {
      console.error('   User with this username or email already exists');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

