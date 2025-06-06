import { orders } from "./channels/orders.ts";

// Publish / Subscribe
orders.consume('orders', async message => {
    if(!message){
        return null
    }
    console.log(message?.content.toString())

    orders.ack(message)
}, {
    noAck: false,
})


// acknowledge => reconhecer - dizer que a mensagem foi recebida com sucesso