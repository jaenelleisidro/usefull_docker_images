const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092','localhost:9094','localhost:9096']
})

const start=async ()=>{
	const consumer = kafka.consumer({ groupId: 'test-group' })

	await consumer.connect()
	await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
	
	await consumer.run({
	  eachMessage: async ({ topic, partition, message }) => {
		console.log({
		  value: message.value.toString(),
		})
	  },
	});
}
start().catch((e)=>{
  console.log(e);
});