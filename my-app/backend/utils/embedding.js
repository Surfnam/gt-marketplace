import { GoogleGenerativeAI } from "@google/generative-ai";


export const getEmbedding = async (text) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    try {
        const res = await model.embedContent(text);
        console.log("Created embedding");
        return res.embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error; // propagate error
    }
};

