import { END, START, StateGraph, Annotation } from "@langchain/langgraph";

// 1. Define the State with a Reducer
const GraphState = Annotation.Root({
// The 'message' field is an array of strings.
message: Annotation<string[]>({
// The reducer tells the graph HOW to update this field.
// x: the current value of 'message' in the state.
// y: the new value being returned by a node.
// We concatenate them to accumulate messages instead of overwriting.
reducer: (x, y) => x.concat(y),
}),
});

// 2. Define our Nodes
// Each node now returns an array, which will be concatenated by the reducer.
const nodeA = (state: typeof GraphState.State) => {
console.log(" - - Executing Node A - -");
return { message: ["A has finished."] };
};
const nodeB = (state: typeof GraphState.State) => {
console.log(" - - Executing Node B - -");
return { message: ["B has finished."] };
};
const nodeC = (state: typeof GraphState.State) => {
console.log(" - - Executing Node C - -");
return { message: ["C has finished."] };
};
const nodeD = (state: typeof GraphState.State) => {
console.log(" - - Executing Node D - -");
// Node D runs last, after B and C are complete.
// It can see the accumulated messages from all previous nodes.
console.log("Full message history in Node D:", state.message);
return { message: ["D has finished."] };
};

// 3. Build the Graph
const builder = new StateGraph(GraphState)
.addNode("a", nodeA)
.addNode("b", nodeB)
.addNode("c", nodeC)
.addNode("d", nodeD);

// 4. Define the Edges to create parallelism
builder
.addEdge(START, "a")
// From "a", we branch out to "b" AND "c". They will run in parallel.
.addEdge("a", "b")
.addEdge("a", "c")
// From "b", we go to "d".
.addEdge("b", "d")
// From "c", we also go to "d".
// Node "d" will only execute after BOTH "b" and "c" have completed.
.addEdge("c", "d")
.addEdge("d", END);

// Compile the graph and visualize it
const graph = builder.compile();
const mermaidSyntax = graph.getGraph().drawMermaid();
console.log(" - - Mermaid Diagram Syntax - -");
console.log(mermaidSyntax);
console.log(" - - - - - - - - - - - - - - \n");

// Main execution block
(async () => {
try {
console.log(">>> Starting Graph Execution…");
const result1 = await graph.invoke({ message: ["Initial Message"] });
console.log("\n - - Final Result - -");
console.log(result1);
} catch (error) {
console.error("Error in main execution:", (error as Error).message);
}
})();