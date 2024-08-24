// add this to a cronjob, or use an extra npm package
// or vercel cronjob configuration
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function cleanupExpiredTokens() {
  const expirationTime = 1 * 60 * 60 * 1000; // 1 hour 
  const currentTime = new Date()

  try {
    const result = await prisma.recuperation.deleteMany({
      where: {
        createdAt: {
          lt: new Date(currentTime.getTime() - expirationTime),
        },
      },
    });

    console.log(`Running cronjob...`)
    console.log(`Deleted tokens: ${result.count}`);
  } catch (error) {
    console.error('Error cleaning tokens:', error);
  } finally {
    await prisma.$disconnect();
  }
}


cleanupExpiredTokens();

