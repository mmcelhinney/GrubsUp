import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Add connection error handling
prisma.$connect().catch((error) => {
  console.error('❌ DATABASE CONNECTION ERROR:', error);
  console.error('   Make sure MySQL is running and DATABASE_URL is correct in .env');
});

export default prisma;

