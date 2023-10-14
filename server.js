const express = require("express");
const app = express();
const menuRouter = require("./routes/menu");
const mysql = require("mysql");
const fileUpload = require("express-fileupload");

const PORT = 8000;

app.use(fileUpload());

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
// app.use(mylogger);

// connection pool
const pool = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "root",
	password: "",
	database: "mymen-info",
});

app.get("/", (req, res) => {
	// console.log("helloExpress");
	// res.send("<h1>こんにちは</h1>");
	// res.sendStatus(400);
	// res.status(500).send("エラー");
	// res.status(500).json({msg: "エラーです"});
	pool.getConnection((err, connection) => {
		if (err) throw err;

		console.log("mysqlと接続中");

		//データ取得
		connection.query("SELECT * FROM info", (err, rows) => {
			connection.release();

			console.log(rows);
			if (!err) {
				res.render("index", { rows });
			}
		});
	});
});

app.get("/form", (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) throw err;

		console.log("mysqlと接続中");

		//データ取得
		connection.query("SELECT * FROM info", (err, rows) => {
			connection.release();

			console.log(rows);
			if (!err) {
				res.render("form", { rows });
			}
		});
	});
});

app.post("/form", (req, res) => {
	if (!req.files) {
		return res.status(400).send("何も画像がアップロードされていません");
	}

	let imageFile = req.files.imageFile;
	let uploadPath = __dirname + "/public/upload/" + imageFile.name;
	let shopName = req.body.shopName;
	let menScore = req.body.menScore;
	let soupScore = req.body.soupScore;
	let toppingScore = req.body.toppingScore;
	let comment = req.body.comment;

	//サーバーに画像ファイルを置く場所の指定
	imageFile.mv(uploadPath, function (err) {
		if (err) return res.status(500).send(err);
		// res.send("画像アップロードに成功しました");
	});

	//mysqlに画像ファイルの名前を追加して保存する
	pool.getConnection((err, connection) => {
		if (err) throw err;

		console.log("mysqlと接続中");
		connection.query(
			`INSERT INTO info (shopName, image, men, soup, topping, comment) VALUES ("${shopName}", "${imageFile.name}", "${menScore}", "${soupScore}", "${toppingScore}", "${comment}")`,
			(err, rows) => {
				connection.release();

				console.log(rows);
				if (!err) {
					res.redirect("/");
				} else {
					console.log(err);
				}
			}
		);
	});
});

//ルーティング設計
app.use("/menu", menuRouter);
// app.use("/auth", authRouter);
// app.use("/customer", customreRouter);
// app.use("/product", productRouter);

//ミドルウェア
function mylogger(req, res, next) {
	console.log(req.originalUrl);
	next();
}

app.listen(PORT, () => console.log("サーバーが起動しました"));
