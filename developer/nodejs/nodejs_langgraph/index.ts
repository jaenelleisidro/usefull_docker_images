import {  ChatOllama } from "@langchain/ollama";
import { tool } from "@langchain/core/tools";
import { TavilySearch } from "@langchain/tavily";
import {
  ChatPromptTemplate,
  MessagesPlaceholder, // <-- New Import
} from "@langchain/core/prompts";
import { HumanMessage } from "@langchain/core/messages";
import { createAgent } from "langchain";
import { z } from "zod";

// const {GROQ_MODEL,GROQ_API_KEY} = process.env;

// const model = new ChatGroq({
//   model: GROQ_MODEL,
//   apiKey: GROQ_API_KEY,
// });

const {
    OLLAMA_MODEL,
    OLLAMA_BASEURL
} = process.env;

const model = new ChatOllama({
    model: OLLAMA_MODEL,
    baseUrl: OLLAMA_BASEURL,
});

// Our tools are defined exactly the same way as before!
const addNumbersTool = tool(
  async ({ a, b }: { a: number, b: number }) => (a + b).toString(),
  {
    name: "add_numbers",
    description: "Adds two numbers and returns the sum.",
    schema: z.object({
      a: z.number().describe("The first number"),
      b: z.number().describe("The second number"),
    }),
  }
);
const tavilySearchTool = new TavilySearch({ maxResults: 3 });
const tools = [addNumbersTool, tavilySearchTool];

// We still bind the tools to the model to make it "tool-aware"
// const modelWithTools = model.bindTools(tools);

// NEW: A more advanced prompt template for conversational agents
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Use the provided tools to answer questions."],
  new MessagesPlaceholder("messages"), // <-- This holds the conversation history
]);

// The star of the show: create a pre-built ReAct agent
const agent = createAgent({
  model,
  tools,
  // Note: The prompt is optional and will be inferred from the LLM if not provided.
  // We include it here for clarity.
});

// Our main processing function is now much simpler
const processQuery = async (query: string) => {
  console.log(`\nProcessing query: "${query}"`);
  // We invoke the agent with a list of messages.
  // The agent handles the entire reasoning loop internally.
  const response = await agent.invoke({
    messages: [new HumanMessage(query)],
  });
  // The final answer is in the last message of the output
  const finalMessage = response.messages[response.messages.length - 1];
  return finalMessage.content;
};

// Main execution block remains the same
(async () => {
  try {
    const addQuery = "What is 5 multiplied by 4, and then add 10 to the result?";
    const searchQuery = "Search for the current CEO of OpenAI and then find out what their latest project is.";
    const llmQuery = "Who are you and what can you do?";
    console.log("------------------------");
    const addResult = await processQuery(addQuery);
    console.log("Final Answer (Math):", addResult);
    console.log("------------------------");
    const searchResult = await processQuery(searchQuery);
    console.log("Final Answer (Search):", searchResult);
    console.log("------------------------");
    const llmResult = await processQuery(llmQuery);
    console.log("Final Answer (LLM):", llmResult);
    console.log("------------------------");
  } catch (error) {
    console.error("Error in main execution:", (error as Error).message);
  }
})();