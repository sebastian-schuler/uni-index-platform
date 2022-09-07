PostgreSQL Dev Server:

services.msc
-> postgresql-x64-14 start type manual

start: right click -> start


Setup Prisma

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver or mongodb.
3. Run 'npx prisma db pull' to turn your database schema into a Prisma schema.
4. Run 'npx prisma generate' to generate the Prisma Client. You can then start querying your database.

https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/introspection-typescript-postgres

You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

IMPORTANT: after update

-> import { Country, Course, University } from '@prisma/client'

Click on one of the objects in bracket (Country) to update lint
