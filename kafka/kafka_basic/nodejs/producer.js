const express = require('express');
const app = express();


app.use(express.urlencoded({ extended: false }));

const { Kafka } = require('kafkajs')
const kafka = new Kafka({
  // clientId: 'my-app',
  clientId: 'user',
  brokers: ['localhost:9093']
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