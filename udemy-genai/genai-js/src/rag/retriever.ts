
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from 'dotenv';

dotenv.config();

export async function createRetriever(): Promise<VectorStoreRetriever> {
    const embeddingLLM = new OpenAIEmbeddings({
        model: 'text-embedding-3-small'
    });
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index('langchain-docs');

    const vectorstore = await PineconeStore.fromExistingIndex(embeddingLLM, {
        pineconeIndex
    });
    return vectorstore.asRetriever();
}

// const retriever = await createRetriever();
// console.log('Retriever created successfully!');
// retriever.invoke('What is LangChain?').then(results => {
//     console.log('Retrieved documents:', results);
// }).catch(error => {
//     console.error('Error retrieving documents:', error);
// });