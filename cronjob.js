// add this to a cronjob, or use an extra npm package
// or vercel cronjob configuration
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function cleanupExpiredTokens() {
  const LENGTH = 200
  const tokenExpirationTime = 1 * 60 * 60 * 1000; // 1 hour 
  const currentTime = new Date()

  try {
    // Tokens
    const deletedTokens = await prisma.recuperation.deleteMany({
      where: {
        createdAt: {
          lt: new Date(currentTime.getTime() - tokenExpirationTime),
        },
      },
    });


    // Messages
    const deletedMessages = undefined
    for (let i = 1; i <= 3; i++) {
      const messageCount = await prisma.messages.count({
        where: {
          roomId: i
        }
      })

      if (messageCount > LENGTH) {
        const oldestMessages = await prisma.messages.findMany({
          where: {
            roomId: i
          },
          orderBy: {
            createdAt: "asc"
          },
          take: messageCount - LENGTH
        })
        const messagesIdsToDelete = oldestMessages.map(message => message.id)
        deletedMessages = await prisma.messages.deleteMany({
          where: {
            id: {
              in: messagesIdsToDelete
            }
          }
        })
      }
    }


    // Log  
    console.log(`> Running cronjob...`)
    console.log(`>> Tokens deleted: ${deletedTokens.count}`);
    console.log(`>> Messages deleted: ${deletedMessages !== undefined ? deletedMessages.count : "0"}`);
  } catch (error) {
    console.error('Error cleaning tokens and/or messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}


cleanupExpiredTokens();

