import kafka from 'kafka-node';

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(client);

export const produceMessage = (message: object) => {
    return new Promise((resolve, reject) => {
        const payloads = [{ topic: 'order-topic', messages: JSON.stringify(message) }];
        producer.send(payloads, (error, data) => {
            if (error) return reject(error);
            resolve(data);
        });
    });
};