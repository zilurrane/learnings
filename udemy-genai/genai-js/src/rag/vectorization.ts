import dotenv from 'dotenv';
// import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';
import cliProgress from 'cli-progress';

import { loadDocuments } from './loadDocuments';
import { splitDocuments } from './splitDocuments';
import { PineconeStore } from '@langchain/pinecone';
import { OllamaEmbeddings } from '@langchain/ollama';

dotenv.config();

const rawDocuments = await loadDocuments();
console.log(`Loaded ${rawDocuments.length} raw documents.`);
const documentChunks = await splitDocuments(rawDocuments);
console.log(`Generated ${documentChunks.length} document chunks.`);

// const embeddingLLM = new OpenAIEmbeddings({
//     model: 'text-embedding-3-small'
// });

const embeddingLLM = new OllamaEmbeddings({
    model: "mxbai-embed-large", // Default value
});


const pinecone = new Pinecone();

const pineconeIndex = pinecone.Index('lanchain-docs-ollma');

console.log('Starting to vectorize and store documents in Pinecone...');

const progressBar = new cliProgress.SingleBar({
    format: 'Documents Vectorized: {value}/{total}',
});
progressBar.start(documentChunks.length, 0);

for (let i = 0; i < documentChunks.length; i = i + 100) {
    const batch = documentChunks.slice(i, i + 100);
    await PineconeStore.fromDocuments(batch, embeddingLLM, {
        pineconeIndex
    });
    progressBar.increment(batch.length);
}
progressBar.stop();
console.log('All documents vectorized and stored in Pinecone successfully!');
