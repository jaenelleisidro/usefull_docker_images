import 'dotenv/config';

const {
  OLLAMA_QDRANT_TRAINING_DATA,
  OLLAMA_EMBEDDINGS_BASEURL,
  OLLAMA_EMBEDDINGS_MODEL,
  OLLAMA_QDRANT_URL,
  OLLAMA_QDRANT_COLLECTION_NAME,
} = process.env;

import {connectQdrantVectorDb} from './utils/langchain.utils.js'
import {insertFilesToVectorDB} from './utils/qdrant.utils.js'

async function start() {
  const vectorStore = await connectQdrantVectorDb(OLLAMA_EMBEDDINGS_MODEL,OLLAMA_EMBEDDINGS_BASEURL,OLLAMA_QDRANT_URL,OLLAMA_QDRANT_COLLECTION_NAME);

  await insertFilesToVectorDB(vectorStore,OLLAMA_QDRANT_TRAINING_DATA, "pdf");
  await insertFilesToVectorDB(vectorStore,OLLAMA_QDRANT_TRAINING_DATA, "txt");
  await insertFilesToVectorDB(vectorStore,OLLAMA_QDRANT_TRAINING_DATA, "html");
  console.log("finished processding files")
}
start()