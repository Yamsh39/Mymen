const express = require("express");
const app = express();
const contentsRouter = require("./routes/contents");

const PORT = 8000;

app.set("view engine", "ejs"); 

// app.use(mylogger);

app.get("/", (req, res) =>{
    // console.log("helloExpress");
    // res.send("<h1>こんにちは</h1>");
    // res.sendStatus(400);
    // res.status(500).send("エラー");
    // res.status(500).json({msg: "エラーです"});
    res.render("index", {text: "NodejsとExpress"});
});

app.get("/form", (req, res) =>{
    res.render("form/form");
});

//ルーティング設計
app.use("/contents", contentsRouter);
// app.use("/auth", authRouter);
// app.use("/customer", customreRouter);
// app.use("/product", productRouter);

//ミドルウェア
function mylogger(req, res, next) {
    console.log(req.originalUrl);
    next();
};


app.listen(PORT, () => console.log("サーバーが起動しました"));