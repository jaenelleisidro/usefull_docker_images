const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: false }));


app.get('/',async (req, res) => {
	res.json({status:"success",data:"the server is running!"});
});


app.listen(port, () => console.log('Server running on port:'+port));