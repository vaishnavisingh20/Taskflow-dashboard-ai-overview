import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { task } = await req.json();

    if (!task) {
      return Response.json(
        {
          error: "Task title is required",
        },
        {
          status: 400,
        }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(`
Generate exactly 5 subtasks for:

${task}

Return only bullet points.
`);

    const response = result.response.text();

    return Response.json({
      subtasks: response,
    });
  } catch (error) {
  console.error("Gemini Error:", error);

  return Response.json(
    {
      subtasks:
        "- Research the task\n- Plan the steps\n- Execute the work\n- Review progress\n- Complete and verify results",
      warning:
        "AI quota exceeded. Showing fallback subtasks.",
    },
    {
      status: 200,
    }
  );
}
}