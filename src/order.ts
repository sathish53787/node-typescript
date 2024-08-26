import { Router } from 'express';
import { db } from './db';
import { produceMessage } from './kafkaProducer';
import { RowDataPacket, OkPacket } from 'mysql2';

const router = Router();

router.post('/order', async (req, res) => {
    const { userId, orderType, currencySymbol, price, quantity } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO orders (user_id, order_type, currency_symbol, price, quantity, status) VALUES (?, ?, ?, ?, ?, 'open')`,
            [userId, orderType, currencySymbol, price, quantity]
        );

        const [existingBalance] = await db.query<RowDataPacket[]>(
            `SELECT * FROM balances WHERE user_id = ? `,
            [userId]
        );

        if (existingBalance.length > 0) {
            console.log("Already exists data")
        }
        else {
            await db.query(
                `INSERT INTO balances (user_id, currency_symbol, balance) VALUES (?, ?, ?)`,
                [userId, currencySymbol, quantity]
            );
        }

        await produceMessage({ userId, orderType, currencySymbol, price, quantity });
        
        res.status(201).json({ message: "Order Added Successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

export default router;