import express from 'express';
import { z } from 'zod';
import cors from 'cors';

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



app.listen(3334, '0.0.0.0', () => {
    console.log(`[invoices] Server is running on http://localhost:3333`);
});
