import { PrismaClient } from '@prisma/client'
console.log("Starting to init prisma...")
const prisma = new PrismaClient()
console.log("prisma initilaized...")
prisma.$connect().then(() => console.log("Connected to db!"))

export default prisma