import 'dotenv/config';
import * as fs from "fs";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

import {setup} from './langchain.utils.js'

const {
  OLLAMA_MODEL,
  OLLAMA_BASEURL,
  OLLAMA_EMBEDDINGS_BASEURL,
  OLLAMA_EMBEDDINGS_MODEL,
  OLLAMA_QDRANT_URL,
  OLLAMA_QDRANT_COLLECTION_NAME,
} = process.env;



// const {vectorStore} = await setup(OLLAMA_MODEL,OLLAMA_BASEURL,OLLAMA_EMBEDDINGS_MODEL,OLLAMA_EMBEDDINGS_BASEURL,OLLAMA_QDRANT_URL,OLLAMA_QDRANT_COLLECTION_NAME);

// Helper function to add a slight artificial delay if rate limits are tight
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

async function insertPDFToVectorDb(vectorStore,filePath, batchSize = 20, cooldown) {
  // Load the PDF file
  const loader = new PDFLoader(filePath, {
    splitPages: true, // Separates documents page-by-page automatically
  });
  const rawDocuments = await loader.load();

  //Chunk the text into smaller, overlapping segments
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,      // Maximum characters per text chunk
    chunkOverlap: 200,    // Text overlap between adjacent chunks to maintain context
  });

  const chunkedDocuments = await textSplitter.splitDocuments(rawDocuments);

  //Inject your custom metadata into each chunk
  chunkedDocuments.forEach((doc) => {
    // Keep existing PDF metadata (source/page number) and append new fields
    doc.metadata = {
      ...doc.metadata,
      uploadedAt: new Date().toISOString(),
    };
  });

  console.log(`Successfully split PDF into ${chunkedDocuments.length} chunks.`);

  const documentBatches = chunkArray(chunkedDocuments, batchSize);

  for (let j = 0; j < documentBatches.length; j++) {
    console.log(`Processing batch ${j + 1} of ${documentBatches.length}...`);
    // High-density insert of 20(batchSize) elements at a time
    await insertDocuments(vectorStore,documentBatches[j], cooldown);
  }
  console.log("PDF successfully vectorized and stored in Qdrant! ");
}

function addMetaData(doc) {
  doc.metadata = {
    ...doc.metadata,
    uploadedAt: new Date().toISOString(),
  };
  return doc;
}

async function insertDocuments(vectorStore,documents, cooldown=5000) {
  await vectorStore.addDocuments(documents);
  if (cooldown) await delay(cooldown);
}


function listAllFiles(folderPath, fileExtension = "pdf") {
  // List all files in the directory
  const files = fs.readdirSync(folderPath);
  // Filter for PDF files
  const pdfs = files.filter(file => file.toLowerCase().endsWith('.' + fileExtension));
  return pdfs;
}

// async function insertStringArrayToVectorDb(vectorStore) {
//   const rawTexts = [
//     "The Great Gatsby is a 1925 novel written by American author F. Scott Fitzgerald.",
//     "To Kill a Mockingbird is a novel by Harper Lee published in 1960.",
//     "1984 is a dystopian social science fiction novel by English novelist George Orwell."
//   ];

//   // 3. Map raw strings into LangChain Document instances
//   const documents = rawTexts.map((text, index) => {
//     return new Document({
//       pageContent: text,
//       metadata: {
//         source: "literary_history",
//         row_id: index
//       },
//     });
//   });
//   await insertDocuments(vectorStore,documents);
// }

async function insertTextFileToVectorDb(vectorStore,filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  let rawDocument = new Document({
    pageContent: fileContent,
    metadata: { source: filePath } // Tracks file source
  });
  rawDocument = addMetaData(rawDocument);

  // 4. Break the document into smaller pieces
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  // Note: splitDocuments takes an Array of documents
  const chunks = await splitter.splitDocuments([rawDocument]);
  console.log(`Text split into ${chunks.length} chunks.`);

  await insertDocuments(vectorStore,chunks);
}


/**
 * Extracts content from the HTML body and strips out all layout tags.
 * @param {string} htmlString - The raw HTML input string.
 * @returns {string} Clean, normalized plain text.
 */
function cleanHtmlBody(htmlString) {
  // 1. Isolate content inside <body> tags (case-insensitive)
  const bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : htmlString;

  // 2. Remove script and style elements completely (including their inner code)
  content = content.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, ' ');
  content = content.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, ' ');

  // 3. Remove all remaining HTML tags
  content = content.replace(/<[^>]*>/g, ' ');

  // 4. Collapse multiple spaces and line breaks into clean text
  return content.replace(/\s+/g, ' ').trim();
}

async function insertHTMLFileToVectorDb(vectorStore,filePath) {
  const rawHtml = fs.readFileSync(filePath, "utf-8");
  const fileContent = cleanHtmlBody(rawHtml)

  console.log(fileContent);
  let rawDocument = new Document({
    pageContent: fileContent,
    metadata: { source: filePath } // Tracks file source
  });
  rawDocument = addMetaData(rawDocument);

  // 4. Break the document into smaller pieces
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  // Note: splitDocuments takes an Array of documents
  const chunks = await splitter.splitDocuments([rawDocument]);
  console.log(`Text split into ${chunks.length} chunks.`);

  await insertDocuments(vectorStore,chunks);
}

export async function insertFilesToVectorDB(vectorStore,folderPath, fileExtension) {
  const files = listAllFiles(folderPath, fileExtension);

  if (fileExtension === "pdf") {
    for await (const file of files) {
      console.log("reading : "+file);
      await insertPDFToVectorDb(vectorStore,`${folderPath}/${file}`)
    }
  } else if (fileExtension === "txt") {
    for await (const file of files) {
      console.log("reading : "+file);
      await insertTextFileToVectorDb(vectorStore,`${folderPath}/${file}`)
    }
  } else if (fileExtension === "html") {
    for await (const file of files) {
      console.log("reading : "+file);
      await insertHTMLFileToVectorDb(vectorStore,`${folderPath}/${file}`)
    }
  }else{
    throw Error("file type :"+fileExtension + " not recognized")
  }
}