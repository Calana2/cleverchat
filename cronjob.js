const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupExpiredTokens() {
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
    
    console.log(`Tokens eliminados: ${result.count}`);
  } catch (error) {
    console.error('Error al limpiar tokens:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecuta la función
cleanupExpiredTokens();

