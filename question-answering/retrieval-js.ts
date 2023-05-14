require('dotenv').config()
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";


export const run = async () => {
  // Initialize the LLM to use to answer the question.
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY
  });
  const loader = new PDFLoader("source_docs/LEAVE_POLICY_2016.pdf")
  const docs = await loader.load();
  // Create a vector store from the documents.
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  const res = await chain.call({
    query: "Who approves compensatory off?",
  });
  console.log({ res });
};
run()