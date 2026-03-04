import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@rockstandard.com";
const adminPass = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

async function main() {
  const hash = await bcrypt.hash(adminPass, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hash, role: "admin", disabled: false },
    create: { email: adminEmail, passwordHash: hash, role: "admin" },
  });
  console.log(`Seeded admin: ${adminEmail} (password: ${adminPass})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
