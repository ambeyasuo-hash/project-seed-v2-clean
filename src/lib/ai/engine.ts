import { GoogleGenerativeAI } from "@google/generative-ai";
import { TECHNICAL_CONSTANTS } from "../constants";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const askAi = async (prompt: string, context: string) => {
  const model = genAI.getGenerativeModel({ 
    model: TECHNICAL_CONSTANTS.MODEL_NAME,
    systemInstruction: TECHNICAL_CONSTANTS.SAFETY_PROMPT
  });

  const fullPrompt = `以下の情報を基に回答してください。\n【コンテキスト】\n${context}\n\n【質問】\n${prompt}`;
  
  const result = await model.generateContent(fullPrompt);
  return result.response.text();
};
export const checkRisk = async (context: string) => {
  const model = genAI.getGenerativeModel({ 
    model: TECHNICAL_CONSTANTS.MODEL_NAME,
    systemInstruction: TECHNICAL_CONSTANTS.SAFETY_PROMPT // 「RISK か SAFE で判定せよ」という指示
  });

  const prompt = `以下のスタッフ状況から、離職やトラブルの兆候（RISK）があるか判定し、理由を添えて短く回答してください。\n${context}`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};