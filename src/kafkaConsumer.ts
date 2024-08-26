import kafka from 'kafka-node';
import { db } from './db';

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new kafka.Consumer(
    client,
    [{ topic: 'order-topic', partition: 0 }],
    { autoCommit: true }
);

consumer.on('message', async (message) => {
    const messageValue = typeof message.value === 'string' ? message.value : message.value.toString();
    const { userId, orderType, currencySymbol, price, quantity } = JSON.parse(messageValue);
    try {
        if (orderType === 'buy') {
            
            await db.query(`UPDATE balances SET balance = balance + ? WHERE user_id = ? AND currency_symbol = ?`, [quantity, userId, currencySymbol]);
            
        } else {
            await db.query(`UPDATE balances SET balance = balance - ? WHERE user_id = ? AND currency_symbol = ?`, [quantity, userId, currencySymbol]);
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

