import { END, START, StateGraph, Annotation } from "@langchain/langgraph";

// 1. Define the State of our Graph
// This is the "memory" that all nodes will share and can modify.
// For this simple example, our state is an object with just one key: `message`.
const StateAnnotation = Annotation.Root({
  message: Annotation<string>(),
});

// 2. Define our Nodes
// A node is just a function that receives the current state and returns an
// object with the properties of the state it wants to update.
const nodeA = (state: typeof StateAnnotation.State) => {
  console.log(`--- Executing Node A ---`);
  console.log(`State before: ${JSON.stringify(state)}`);
  return { message: `I have been updated by Node A!` };
};
const nodeB = (state: typeof StateAnnotation.State) => {
  console.log(`--- Executing Node B ---`);
  console.log(`State before: ${JSON.stringify(state)}`);
  return { message: `Node B has finished the job.` };
};

// 3. Define the Graph Structure
console.log("Building the graph...");
const builder = new StateGraph(StateAnnotation)
  .addNode("a", nodeA)
  .addNode("b", nodeB);

// 4. Define the Edges
// This tells the graph how to flow from one node to the next.
builder
  .addEdge(START, "a") // When the graph starts, go to node "a"
  .addEdge("a", "b")   // After "a" finishes, go to node "b"
  .addEdge("b", END);  // After "b" finishes, end the execution.

// 5. Compile the graph into a runnable object
const graph = builder.compile();

// (Optional but awesome) Visualize the graph
// LangGraph can generate syntax for Mermaid, a diagramming tool.
const mermaidSyntax = graph.getGraph().drawMermaid();
console.log("\n--- Mermaid Diagram Syntax ---");
console.log(mermaidSyntax);
console.log("----------------------------\n");

// Main execution block
(async () => {
  try {
    // 6. Run the graph!
    // We invoke it with the initial state.
    const result = await graph.invoke({ message: "This is the initial message." });
    console.log("\n--- Final Result ---");
    console.log(result);
  } catch (error) {
    console.error("Error in main execution:", (error as Error).message);
  }
})();