import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadDocuments } from "./loadDocuments";

export async function splitDocuments(rawDocuments: Document[]): Promise<Document[]> {
    console.log(`Starting to split ${rawDocuments.length} documents...`);
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
        chunkSize: 500,
        chunkOverlap: 100,
    });
    const documentChunks = await splitter.splitDocuments(rawDocuments);
    console.log(`Split ${rawDocuments.length} documents into ${documentChunks.length} chunks.`);
    return documentChunks;
}

// const rawDocuments: Document[] = await loadDocuments();
// const documentChunks = await splitDocuments(rawDocuments);
// console.log(`Generated ${documentChunks.length} document chunks.`);

// console.log("First 5 document chunks:");
// for (let i = 0; i < 5 && i < documentChunks.length; i++) {
//     console.log(`Chunk ${i + 1}:`, documentChunks[i].pageContent, "...");
// }  
