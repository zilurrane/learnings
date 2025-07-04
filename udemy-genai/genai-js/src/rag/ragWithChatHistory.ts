import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createRetriever } from "./retriever";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { chat, ChatHandler } from "../utils/chat";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

export const prompt = ChatPromptTemplate.fromMessages(
    [[
        'human',
        `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question.
        If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
        Context: {context}
        `
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
    ]
);

const llm = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    maxTokens: 500
});

const outputParser = new StringOutputParser();

const retriever = await createRetriever();

const retrievalChain = RunnableSequence.from([
    (input) => input.question,
    retriever,
    formatDocumentsAsString,
]);

const generationChain = RunnableSequence.from([
    {
        question: (input) => input.question,
        context: retrievalChain,
        chat_history: (input) => input.chat_history,
    },
    prompt,
    llm,
    outputParser,
]);

const qcSystemPrompt = `Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.`;

const qcPrompt = ChatPromptTemplate.fromMessages([
    ["system", qcSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
]);

const qcChain = RunnableSequence.from([
    qcPrompt,
    llm,
    outputParser,
]);

const chatHistory: BaseMessage[] = [];

const chatHandler: ChatHandler = async (question: string) => {

    let contextualizedQuestion = null;
    if (chatHistory.length > 0) {
        contextualizedQuestion = await qcChain.invoke({
            question,
            chat_history: chatHistory,
        });
        console.log('Contextualized question:', contextualizedQuestion);
    }

    return {
        answer: generationChain.stream({
            question: contextualizedQuestion || question,
            chat_history: chatHistory,
        }),
        answerCallBack: async (answerText: string) => {
            chatHistory.push(new HumanMessage(contextualizedQuestion || question));
            chatHistory.push(new AIMessage(answerText));
        }
    }
}

chat(chatHandler);
