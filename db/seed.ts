import { PrismaClient } from '@prisma/client';
import { hash } from '@/lib/encrypt';
import sampleData from './sample-data';

async function main(){
    const prisma = new PrismaClient();
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();


    const users = [];
    for (let i = 0; i < sampleData.users.length; i++) {
        users.push({
            ...sampleData.users[i],
            password: await hash(sampleData.users[i].password),
        });
        console.log(
            sampleData.users[i].password,
            await hash(sampleData.users[i].password)
        );
    }
    await prisma.user.createMany({ data: users });
    await prisma.user.createMany({ data: sampleData.users });

    console.log('Database seeded with sample data...');
}

main()