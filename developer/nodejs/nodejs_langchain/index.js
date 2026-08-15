import 'dotenv/config';
import {prompt,connectQdrantVectorDb,connectOllama} from './utils/langchain.utils.js'

const {
    OLLAMA_EMBEDDINGS_BASEURL,
    OLLAMA_EMBEDDINGS_MODEL,
    OLLAMA_QDRANT_URL,
    OLLAMA_QDRANT_COLLECTION_NAME,
    OLLAMA_MODEL,
    OLLAMA_BASEURL
} = process.env;

async function start() {
    const vectorStore = await connectQdrantVectorDb(OLLAMA_EMBEDDINGS_MODEL,OLLAMA_EMBEDDINGS_BASEURL,OLLAMA_QDRANT_URL,OLLAMA_QDRANT_COLLECTION_NAME);
    const llm = await connectOllama(OLLAMA_MODEL,OLLAMA_BASEURL);

    const question = "what are the ingredients for pork sinigang?";

    const {answer,formattedSources,executionTime,sourcesCount} = await prompt(llm,vectorStore,question)

    console.log("Answer:", answer);

    console.log(formattedSources);
    console.log("sourcesCount:", sourcesCount);
    console.log(`Execution time: ${executionTime} seconds`);
}

start();