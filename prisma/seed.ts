import { PrismaClient } from "../app/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const demoUserID = "0aa6c220-7e2d-4489-a8f5-c67ff3e7a578";

  await prisma.product.createMany({
    data: Array.from({ length: 25 }).map((_, index) => ({
      userId: demoUserID,
      name: `Product ${index + 1}`,
      price: Math.floor(Math.random() * 90 + 10).toFixed(2),
      quantity: Math.floor(Math.random() * 20),
      lowStockAt: 5,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index * 5)),
    })),
  });

  console.log("Database seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
