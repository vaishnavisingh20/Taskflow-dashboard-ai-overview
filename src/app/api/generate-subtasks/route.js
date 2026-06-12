import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export async function POST(req) {
  try {
    const { task } = await req.json();

    const model =
      genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

    const result =
      await model.generateContent(
        `
Generate exactly 5 subtasks for:

${task}

Return only bullet points.
`
      );

    const response =
      result.response.text();

    return Response.json({
      subtasks: response,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}