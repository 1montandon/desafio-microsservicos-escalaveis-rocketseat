import { integer } from 'drizzle-orm/pg-core'
import { timestamp } from 'drizzle-orm/pg-core'
import { pgEnum } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { customers } from './customers.ts'

export const orderStatusEnum = pgEnum('order_status', [
    'pending',
    'canceled',
    'paid'  
])

export const orders = pgTable('orders', {
    id: text().primaryKey(),
    customerId: text().notNull().references(() => customers.id),
    amount: integer(),
    status: orderStatusEnum().notNull().default('pending'),
    createdAt: timestamp().defaultNow().notNull()
})