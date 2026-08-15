this is a simple ai agent that can answer questions using custom training data

in order to run this you'll need an ollama and qdrant server 
run start.sh in order for docker to run this servers

after it finishes,
we need ollama server to download 2 ai models namely nomic-embed-text, and qwen3.5:4b
you can do that by running setup.sh

after that
we will need some training data 
you can place the training data at data/trainging_data
it will accept pdf html and txt files.

once the training data is available, 
we load this training data to our qdrant server

we can do that by doing
npm install and then running node seed.js
it will take some time for this to finish around 15 minutes maybe.

after that
you should be able to see a collection named training_data at qdrant dashboard 
you can see it via http://localhost:6333/dashboard#/collections

we can now ask questions to our ai agent 
modify node index.js and place the question you want to ask.
run node index.js to see if it was able to answer the question.
