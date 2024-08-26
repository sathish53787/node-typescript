import express from 'express';
import bodyParser from 'body-parser';
import orderRoutes from './order';

const app = express();
app.use(bodyParser.json());

app.use('/api', orderRoutes);

app.listen(3000, () => {
    console.log('Server running on 3000');
});

// Start Kafka Consumer
import './kafkaConsumer';