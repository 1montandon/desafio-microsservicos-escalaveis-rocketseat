import express from 'express';
import { z } from 'zod';
import { validateRequest  } from 'zod-express-middleware';
import cors from 'cors'

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




app.post('/orders', validateRequest(bodySchema), (request, response): void => {
    const { amount } = request.body
    console.log('Craeting an order with amount', amount)
    response.status(201).json({})
})

app.listen(3333, '0.0.0.0', () => {
    console.log(`[Orders] Server is running on http://localhost:3333`);
});
