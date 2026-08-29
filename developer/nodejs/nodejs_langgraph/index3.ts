import { END, START, StateGraph, Annotation } from "@langchain/langgraph";

// 1. Define the State
// We've added a 'someNumber' field to our state.
const GraphState = Annotation.Root({
  message: Annotation<string>(),
  someNumber: Annotation<number>(),
});

// 2. Define our Nodes
const nodeA = (state: typeof GraphState.State) => {
  console.log("--- Executing Node A ---");
  // Node A calculates a value based on the input message and updates the state.
  const newNumber = state.message.length;
  console.log(`Node A calculated the number: ${newNumber}`);
  return {
    someNumber: newNumber,
  };
};
const nodeB = (state: typeof GraphState.State) => {
  console.log("--- Executing Node B ---");
  return { message: `I'm B, because the number was not 0.` };
};
const nodeC = (state: typeof GraphState.State) => {
  console.log("--- Executing Node C ---");
  return { message: `I'm C, because the number was 0!` };
};

// 3. Define the Router Function for our Conditional Edge
// This function reads the state and decides which path to take.
// It does NOT modify the state.
const shouldGoToC = (state: typeof GraphState.State) => {
  console.log(`\n--- Making a Decision ---`);
  console.log(`Checking the number in state: ${state.someNumber}`);
  if (state.someNumber === 0) {
    console.log("Decision: Go to C");
    return "goToC"; // This key maps to Node C
  } else {
    console.log("Decision: Go to B");
    return "goToB"; // This key maps to Node B
  }
};

// 4. Build the Graph
const builder = new StateGraph(GraphState)
  .addNode("a", nodeA)
  .addNode("b", nodeB)
  .addNode("c", nodeC);
// Set the entry point
builder.addEdge(START, "a");

// 5. Add the Conditional Edge
// After node "a" completes, call the `shouldGoToC` function.
// Based on its return value, go to either node "b" or node "c".
builder.addConditionalEdges("a", shouldGoToC, {
  goToB: "b",
  goToC: "c",
});

// 6. Connect the final nodes to the end
builder.addEdge("b", END);
builder.addEdge("c", END);

// Compile the graph and visualize it
const graph = builder.compile();
const mermaidSyntax = graph.getGraph().drawMermaid();
console.log("--- Mermaid Diagram Syntax ---");
console.log(mermaidSyntax);
console.log("----------------------------\n");

// Main execution block
(async () => {
  try {

    // Run 1: The message length is not 0, so it should go to Node B.
    console.log(">>> Starting Run 1...");
    const result1 = await graph.invoke({ message: "Hello", someNumber: 0 }); // Note: initial someNumber doesn't matter, Node A overwrites it.
    console.log("Final result for run 1:", result1);
    console.log("\n----------------------------\n");

    // Run 2: The message length is 0, so it should go to Node C.
    console.log(">>> Starting Run 2...");
    const result2 = await graph.invoke({ message: "", someNumber: 999 });
    console.log("Final result for run 2:", result2);
  } catch (error) {
    console.error("Error in main execution:", (error as Error).message);
  }
})();