var express = require('express');
const path = require('path');

var app = express();

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname,'../public');


app.use(express.static(publicPath));
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

//eexpress static to fill public folder + appeler sur port 3000