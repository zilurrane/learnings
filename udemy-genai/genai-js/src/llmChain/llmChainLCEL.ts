import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates a personalized pitch for a course based on the user's role and word limit.
 * @param course - The course to be pitched.
 * @param role - The user's role.
 * @param wordLimit - The maximum number of words for the output.
 * @returns A formatted prompt string.
 */
async function personalizedPitch(course: string, role: string, wordLimit: number): Promise<void> {
    const promptTemplate = new PromptTemplate({
        template: "Describe importance of learning {course} for a {role}. Limit the output to {wordLimit} words.",
        inputVariables: ["course", "role", "wordLimit"],
    });

    const llm = new ChatOpenAI({
        // temperature: 1
        // topP: 1,
        // maxTokens: 10,
        modelName: "gpt-3.5-turbo",
    });

    const outputParser = new StringOutputParser();
    
    // const lcelChain = promptTemplate.pipe(llm).pipe(outputParser);

    const lcelChain = RunnableSequence.from([
        promptTemplate,
        llm,
        outputParser,
    ]);

    const lcelChainResponse = await lcelChain.invoke({
        course,
        role,
        wordLimit
    });

    console.log("Answer from LCEL LLM Chain:", lcelChainResponse);

}

const formatedPrompt = await personalizedPitch("Generative AI", "JavaScript Developer", 50);

// Output: Describe importance of learning Generative AI for a JavaScript Developer. Limit the output to 50 words.