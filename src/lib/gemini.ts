import { GoogleGenerativeAI, Part } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in environment variables.");
}

export const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export function getModel() {
  return geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
}

export interface ToolCall {
  name: string;
  args: any;
}

export async function runAgent(
  prompt: string,
  tools: { declarations: any[]; implementations: Record<string, Function> },
  history: any[] = []
) {
  const model = geminiClient.getGenerativeModel({
    model: "gemini-1.5-flash",
    tools: [{ functionDeclarations: tools.declarations }],
  });

  const chat = model.startChat({
    history: history,
  });

  let result = await chat.sendMessage(prompt);
  let response = result.response;
  const toolCallsMade: string[] = [];

  // Loop to handle potential multiple tool calls (Gemini might call tools sequentially)
  while (response.candidates?.[0]?.content?.parts?.some(part => part.functionCall)) {
    const parts = response.candidates[0].content.parts;
    const functionCalls = parts.filter(part => part.functionCall);

    const functionResponses: Part[] = [];

    for (const fc of functionCalls) {
      if (!fc.functionCall) continue;
      const { name, args } = fc.functionCall;
      toolCallsMade.push(name);

      const implementation = tools.implementations[name];
      if (implementation) {
        try {
          const callResult = await implementation(args);
          functionResponses.push({
            functionResponse: {
              name,
              response: { result: callResult },
            },
          });
        } catch (error) {
          console.error(`Error executing tool ${name}:`, error);
          functionResponses.push({
            functionResponse: {
              name,
              response: { error: (error as Error).message },
            },
          });
        }
      } else {
        functionResponses.push({
          functionResponse: {
            name,
            response: { error: `Tool ${name} not found.` },
          },
        });
      }
    }

    // Send function responses back to the model
    result = await chat.sendMessage(functionResponses);
    response = result.response;
  }

  return {
    text: response.text(),
    toolCalls: toolCallsMade,
  };
}
