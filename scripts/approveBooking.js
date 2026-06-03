        const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const pending = await prisma.booking.findFirst({ where: { status: 'PENDING' } });
    if (!pending) {
      console.log('No pending bookings found');
      return;
    }
    const updated = await prisma.booking.update({ where: { id: pending.id }, data: { status: 'APPROVED' } });
    console.log('Approved booking:', updated.id);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
