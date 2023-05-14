require('dotenv').config()
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { input } from '@inquirer/prompts';

const initialize = async () => {
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

  return chain;
};

const answer = async (chain: RetrievalQAChain) => {
  const question = await input({ message: 'Ask your question!' });
  const res = await chain.call({
    query: question,
  });
  console.log("\n", res.text, "\n");
}

const startApp = async () => {
  const chain = await initialize();
  await answer(chain);
}

startApp();

