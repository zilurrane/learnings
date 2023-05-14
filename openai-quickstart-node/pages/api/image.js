import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    // Define the text prompt for the image generation
    const text = req.body.text;

    // const captionCompletionResponse = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: `Use the following words: ${text}. Create a caption for an image that would make an image AI generator create an amazing picture.`,
    //     temperature: 0,
    //     max_tokens: 500
    // });

    try {
        // const caption = captionCompletionResponse.data.choices[0].text
        const response = await openai.createImage({
            prompt: text,
            n: 1,
            size: "512x512",
        });
        res.status(200).json({ result: response.data });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}