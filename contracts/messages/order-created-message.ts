export interface OrderCreatedMessage {
    id: string
    amount: number;
    customer: {
        id: string
    }

}