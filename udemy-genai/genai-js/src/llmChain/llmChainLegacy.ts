import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { LLMChain } from "langchain/chains";

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

    const formatedPrompt = await promptTemplate.format({
        course,
        role,
        wordLimit
    });
    console.log(formatedPrompt);

    const llm = new ChatOpenAI();

    const outputParser = new StringOutputParser();
    
    const legacyLLMChain = new LLMChain({
        llm,
        prompt: promptTemplate,
        outputParser,
    });

    const response = await legacyLLMChain.invoke({
        course,
        role,
        wordLimit
    });

    console.log("Answer from Legacy LLM Chain:", response);

}

const formatedPrompt = await personalizedPitch("Generative AI", "JavaScript Developer", 50);

// Output: Describe importance of learning Generative AI for a JavaScript Developer. Limit the output to 50 words.