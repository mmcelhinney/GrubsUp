import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File-based lock to prevent re-initialization (persists across restarts)
const LOCK_FILE = path.join(__dirname, '../../.db-init.lock');

// Check if Prisma Client is already generated
function isPrismaClientGenerated() {
  try {
    const clientPath = path.join(
      __dirname,
      '../../node_modules/@prisma/client/index.js'
    );
    return existsSync(clientPath);
  } catch {
    return false;
  }
}

// Check if initialization is locked (already done)
function isLocked() {
  try {
    return existsSync(LOCK_FILE);
  } catch {
    return false;
  }
}

// Create lock file
function createLock() {
  try {
    writeFileSync(LOCK_FILE, new Date().toISOString());
  } catch (error) {
    // Ignore lock file errors
  }
}

export async function initDatabase() {
  // Skip if already initialized (file-based lock persists across restarts)
  if (isLocked()) {
    return;
  }

  try {
    console.log('🔄 Initializing database...');

    // Check if Prisma Client exists - if not, skip and warn user
    if (!isPrismaClientGenerated()) {
      console.log('⚠️  Prisma Client not found!');
      console.log('⚠️  Please run: cd backend && npx prisma generate');
      console.log('⚠️  Then restart the server.');
      return;
    }

    console.log('✅ Prisma Client found, proceeding...');

    // Now import PrismaClient after generation
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Run migrations (only if needed, use 'pipe' to avoid watch triggers)
    try {
      execSync('npx prisma migrate deploy', {
        cwd: path.join(__dirname, '../..'),
        stdio: 'pipe', // Use 'pipe' to avoid triggering file watcher
      });
      console.log('✅ Migrations applied successfully');
    } catch (error) {
      // If migrations fail, try to create initial migration
      try {
        execSync('npx prisma migrate dev --name init', {
          cwd: path.join(__dirname, '../..'),
          stdio: 'pipe', // Use 'pipe' to avoid triggering file watcher
        });
        console.log('✅ Initial migration created and applied');
      } catch (migrateError) {
        // Silently ignore if migrations already exist
        if (!migrateError.message.includes('already applied')) {
          console.log('ℹ️  Migrations may already be applied');
        }
      }
    }

    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Create default admin user if it doesn't exist
    const adminExists = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (!adminExists) {
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@dinnersready.com',
          passwordHash: hashedPassword,
          role: 'admin',
        },
      });
      console.log(
        '✅ Default admin user created (username: admin, password: admin123)'
      );
    }

    await prisma.$disconnect();

    // Create lock file to prevent re-initialization (persists across restarts)
    createLock();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // Don't throw - allow server to start even if init fails
  }
}
