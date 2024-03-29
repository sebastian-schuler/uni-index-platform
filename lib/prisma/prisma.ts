import { PrismaClient } from "@prisma/client";

// Docs about instantiating `PrismaClient` with Next.js:
// https://pris.ly/d/help/next-js-best-practices

// let prisma: PrismaClient;


//   prisma = new PrismaClient();

// @ts-ignore
BigInt.prototype.toJSON = function() { return this.toString() }

// export default prisma;

declare global {

  // allow global `var` declarations

  // eslint-disable-next-line no-var

  var prisma: PrismaClient | undefined

}

const prisma =

  global.prisma ||

  new PrismaClient({

    //  log: ['query'],

  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma;