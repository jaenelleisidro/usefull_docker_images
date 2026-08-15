import amqp from 'amqplib';
const connectionUrl = 'amqp://kalo:kalo@localhost:5672'; 
const connection = await amqp.connect(connectionUrl);

const channel = await connection.createChannel();

const queue = 'hello';
const msg = 'Hello World!';

await channel.assertQueue(queue, {
  durable: true,
  arguments: {
    'x-queue-type': 'quorum'
  }
});

channel.sendToQueue(queue, Buffer.from(msg));
console.log(" [x] Sent %s", msg);

setTimeout(function() {
  connection.close();
  process.exit(0)
}, 500);