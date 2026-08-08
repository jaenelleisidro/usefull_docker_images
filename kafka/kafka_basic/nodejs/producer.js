const express = require('express');
const app = express();

const brokers=['localhost:9092','localhost:9094','localhost:9096'];


app.use(express.urlencoded({ extended: false }));

const { Kafka } = require('kafkajs')
const kafka = new Kafka({
  clientId: 'user',
  brokers
})

app.get('/',async (req, res) => {
  const producer = kafka.producer()
  await producer.connect()
  let message={
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  };
  await producer.send(message)

  await producer.disconnect()
	res.json({status:"success",data:message,info:"we sent a message to kafka"});
});

const port = 3000;

app.listen(port, () => console.log('Server running...'));