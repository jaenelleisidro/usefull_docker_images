

import { OllamaEmbeddings, Ollama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { QdrantVectorStore } from "@langchain/qdrant";


export async function setup(ollamaModel,ollamaBaseUrl,ollamaEmbeddingsModel,ollamaEmbeddingsBaseUrl,qdrantUrl,qdrantCollectionName){
    const llm = new Ollama({
        model: ollamaModel,
        baseUrl: ollamaBaseUrl,
    });


    const embeddings = new OllamaEmbeddings({
        model: ollamaEmbeddingsModel,
        baseUrl: ollamaEmbeddingsBaseUrl,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: qdrantUrl,
            collectionName: qdrantCollectionName,
        }
    );

    return {llm,embeddings,vectorStore};
}

export async function connectOllama(ollamaModel,ollamaBaseUrl){
    const llm = new Ollama({
        model: ollamaModel,
        baseUrl: ollamaBaseUrl,
    });
    return llm;
}

export async function connectQdrantVectorDb(ollamaEmbeddingsModel,ollamaEmbeddingsBaseUrl,qdrantUrl,qdrantCollectionName){
    const embeddings = new OllamaEmbeddings({
        model: ollamaEmbeddingsModel,
        baseUrl: ollamaEmbeddingsBaseUrl,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: qdrantUrl,
            collectionName: qdrantCollectionName,
        }
    );

    return vectorStore;
}



// Helper to format documents into a readable text chunk
const formatDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n\n");


export async function prompt(llm,vectorStore,question){
    //Define your prompt template
    const prompt = ChatPromptTemplate.fromTemplate(
        `Answer the question using only the provided context:\n\nContext: {context}\n\nQuestion: {input}`
    );


    const textGenerationChain = RunnableSequence.from([
        prompt,
        llm,
        new StringOutputParser(),
    ]);

    const ragChain = RunnableSequence.from([
        {
            // Fetch raw document arrays from Qdrant first
            docs: vectorStore.asRetriever({ k: 2 }),
            input: new RunnablePassthrough(),
        },
        {
            // Format the fetched docs into text for the LLM prompt, while passing down raw objects
            context: (previousOutput) => formatDocs(previousOutput.docs),
            sourceDocuments: (previousOutput) => previousOutput.docs,
            input: (previousOutput) => previousOutput.input,
        },
        {
            // Execute generation using the formatted properties, while binding the sources to final object
            answer: textGenerationChain,
            sources: (previousOutput) => previousOutput.sourceDocuments,
        }
    ]);

    const startTime = Date.now(); 
    const { answer, sources } = await ragChain.invoke(question);
    const endTime = Date.now(); 
    const executionTime = (endTime - startTime)/1000;
    const sourcesCount = sources.length;
    const formattedSources = sources.map(item => {
        const { source, loc, uploadedAt } = item.metadata;
        const pageNumber = loc?.pageNumber;
        return { source, pageNumber, uploadedAt };
    });

    return {answer,sources,formattedSources, startTime,executionTime,sourcesCount};
}


