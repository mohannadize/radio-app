const express = require("express");
const app = express();
const port = process.env.PORT || 3000;


app.set("view engine", 'pug');
app.use(express.static('public'))


app.get("/", (req, res) => {
    res.render("index");
})

// TODO: /stream_data.+\"(https?.+)\"$/i REGEX

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));