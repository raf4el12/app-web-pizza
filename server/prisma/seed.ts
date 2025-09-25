import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando seed de la base de datos...');


  const customerRole = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: {
      name: 'CUSTOMER',
      description: 'Cliente regular del sistema'
    }
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrador del sistema'
    }
  });

  console.log(` Roles creados: CUSTOMER (${customerRole.id}), ADMIN (${adminRole.id})`);


  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pizzaapp.com' },
    update: {},
    create: {
      roleId: adminRole.id,
      firstName: 'Administrador',
      lastName: 'Rafael_Sistema',
      email: 'admin@pizzaapp.com',
      password: adminPassword,
      phone: '+1234567890',
      status: 'ACTIVE'
    }
  });

  console.log(` Usuario administrador creado: ${adminUser.email}`);

  const customerPassword = await bcrypt.hash('customer123', 10);
  
  const customerUser = await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      roleId: customerRole.id,
      firstName: 'Cliente',
      lastName: 'Prueba',
      email: 'cliente@test.com',
      password: customerPassword,
      phone: '+0987654321',
      status: 'ACTIVE'
    }
  });

  console.log(` Usuario cliente creado: ${customerUser.email}`);

  console.log('Seed completado exitosamente!');
  console.log('\n Usuarios creados:');
  console.log(`   Admin: admin@pizzaapp.com / admin123`);
  console.log(`   Cliente: cliente@test.com / customer123`);
}

main()
  .catch((e) => {
    console.error(' Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });