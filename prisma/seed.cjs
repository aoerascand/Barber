const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const adminEmail = process.env.ADMIN_EMAIL || "admin@barberbooking.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin1234";
const adminName = process.env.ADMIN_NAME || "Admin User";
const adminRole = "ADMIN";

async function main() {
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password: hashedPassword,
      role: adminRole,
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: adminRole,
    },
  });

  console.log(`Admin user ready: ${user.email} (${user.role})`);
  console.log(`Password: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
