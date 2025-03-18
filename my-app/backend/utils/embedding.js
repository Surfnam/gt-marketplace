import { GoogleGenerativeAI } from "@google/generative-ai";

export const getEmbedding = async (text) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-embedding-exp-03-07" });

    const res = await model.embedContent(text);
    console.log(res.embedding.values);
    return res.embedding.values;
};

