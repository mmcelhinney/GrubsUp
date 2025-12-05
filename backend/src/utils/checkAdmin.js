import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log('🔍 Checking admin user in database...\n');

    // Find admin user
    const admin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (!admin) {
      console.log('❌ Admin user NOT FOUND in database');
      console.log('\n💡 Run: npm run db:create-admin');
      await prisma.$disconnect();
      return;
    }

    console.log('✅ Admin user found:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${admin.createdAt}`);
    console.log(`   Has password hash: ${!!admin.passwordHash}`);
    console.log(`   Password hash length: ${admin.passwordHash?.length || 0}`);
    console.log(`   Password hash preview: ${admin.passwordHash?.substring(0, 30)}...`);

    // Test password verification
    console.log('\n🔑 Testing password verification...');
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, admin.passwordHash);
    
    if (isValid) {
      console.log('✅ Password "admin123" is VALID');
    } else {
      console.log('❌ Password "admin123" is INVALID');
      console.log('   The stored password hash does not match "admin123"');
    }

    // List all users
    console.log('\n📋 All users in database:');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    if (allUsers.length === 0) {
      console.log('   No users found');
    } else {
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.role}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();

