import { orders } from "./channels/orders.ts";

// Publish / Subscribe
orders.consume('orders', async message => {
    console.log(message?.content.toString())
}, {
    noAck: false,
})


// acknowledge => reconhecer - dizer que a mensagem foi recebida com sucesso