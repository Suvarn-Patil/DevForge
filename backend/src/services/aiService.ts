import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
  ? new OpenAI({
      apiKey,
    })
  : null;

export const generateAIResponse = async (
  message: string
) => {
  if (!client) {
    throw new Error(
      "OPENAI_API_KEY is not configured"
    );
  }

  const response =
    await client.responses.create({
      model:
        process.env.OPENAI_MODEL ||
        "gpt-4.1-mini",

      instructions:
        "You are DevForge AI, an expert software engineering assistant. Give practical, concise and technically correct answers. Help users with programming, debugging, architecture, databases, APIs, DevOps, Git and software engineering.",

      input: message,
    });

  return response.output_text;
};
