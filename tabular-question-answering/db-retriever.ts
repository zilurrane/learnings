require('dotenv').config()

import { input } from '@inquirer/prompts';
import { DataSource } from "typeorm";
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { SqlDatabaseChain } from "langchain/chains";

const initialize = async () => {
  const datasource = new DataSource({
    type: "sqlite",
    database: "db/Chinook.db",
  });
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
    includesTables: ["Customer"],
  });
  const chain = new SqlDatabaseChain({
    llm: new OpenAI({
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY
    }),
    database: db,
  });
  return chain;
};

const answer = async (chain: SqlDatabaseChain) => {
  const question = await input({ message: 'Ask your question!' });
  const res = await chain.run(question);
  console.log("\n", res, "\n");
}

const startApp = async () => {
  const chain = await initialize();
  await answer(chain);
}

startApp();
