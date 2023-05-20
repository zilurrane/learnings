require('dotenv').config()
import { OpenAI } from "langchain/llms/openai";
import { MapReduceDocumentsChain, RefineDocumentsChain, StuffDocumentsChain, loadSummarizationChain } from "langchain/chains";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const initialize = async () => {
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY
  });
  const chain = loadSummarizationChain(model, { type: "map_reduce" });
  return chain;
};

const summerize = async (chain: StuffDocumentsChain | MapReduceDocumentsChain | RefineDocumentsChain) => {
  const loader = new PDFLoader("source_docs/LEAVE_POLICY_2016.pdf")
  const docs = await loader.load();
  const res = await chain.call({
    input_documents: docs,
  });
  console.log("\n", res?.text, "\n");
}

const startApp = async () => {
  const chain = await initialize();
  await summerize(chain);
}

startApp();

