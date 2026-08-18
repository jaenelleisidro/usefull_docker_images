const express = require("express"); 
const app = express();  

app.get("/", (req, res) => {
 console.log("event received")
 res.json({ message: "Hello from Serverless Express on AWS Lambda!" });
});  

const port = process.env.PORT || 3000; app.listen(port, () => console.log(`Server running on port ${port}`));