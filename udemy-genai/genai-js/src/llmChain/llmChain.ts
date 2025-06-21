import { PromptTemplate } from "@langchain/core/prompts";

const promptTemplate = new PromptTemplate({
    template: "Describe importance of learning {course} for a {role}. Limit the output to {wordLimit} words.",
    inputVariables: ["course", "role", "wordLimit"],
});

const formatedPrompt = await promptTemplate.format({
    course: "Generative AI",
    role: "JavaScript Developer",
    wordLimit: 50,
});

console.log(formatedPrompt);
// Output: Describe importance of learning Generative AI for a JavaScript Developer. Limit the output to 50 words.