import express from 'express';
import { z } from 'zod';
import { validateRequest  } from 'zod-express-middleware';
import cors from 'cors'
import { channels } from '../broker/channels/index.ts';
import { db } from '../database/client.ts';
import { schema } from '../database/schema/index.ts';
import {randomUUID} from 'node:crypto'

const app = express()
app.use(express.json())
app.use(cors())

const bodySchema = z.object({
  amount: z.number(),
});

app.get('/health', (request, response) => {
    response.send("OK");
})

// Escalonamento horizontal
// Maq1
// Maq2

// Deploy Blue-green deployment
// Ver1 100% - 50% - 0%
// Ver2 0% - 50% - 100%


app.post('/orders', validateRequest(bodySchema), async (request, response): void => {
    const { amount } = request.body
    console.log('Craeting an order with amount', amount)

    await db.insert(schema.orders).values({
        id: randomUUID(),
        customerId: '72ea6690-61a4-49c0-b2f3-e4235f22594d',
        amount
    })

    channels.orders.sendToQueue('orders', Buffer.from('Hello World'))

    response.status(201).json({})
})

app.listen(3333, '0.0.0.0', () => {
    console.log(`[Orders] Server is running on http://localhost:3333`);
});
