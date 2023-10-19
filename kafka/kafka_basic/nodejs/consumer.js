const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['winddoctor.tplinkdns.com:9093']
//   brokers: ['localhost:9093']
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