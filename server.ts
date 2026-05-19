import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";

const throwError = (message: string): never => {
	throw new Error(message);
};

const MONGODB =
	process.env.MONGODB_CONNECTION_STRING ??
	throwError("Missing MONGODB_CONNECTION_STRING in .env file");

console.log("MongoDB is: ", MONGODB);

let posts = await new MongoClient(MONGODB)
	.connect()
	.then((client) => {
		console.log("Succesfully connected to MongoDB");
		return client.db("mydatabase").collection("posts");
	})
	.catch((error) => throwError("Unsuccesfully connected to MongoDB"));

// App use
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// App endpoints
app.get("/", (req, res) => {
	posts
		.find()
		.toArray()
		.then((results) => {
			console.log(results);
			res.render("index.ejs", { posts: results });
		})
		.catch((error) => console.error(error));
});

app.post("/posts", (req, res) => {
	console.log(req.body);
	posts
		.insertOne(req.body)
		.then((result) => {
			console.log(result);
			res.redirect("/");
		})
		.catch((error) => console.error(error));
});

app.put("/posts", (req, res) => {
	console.log(req.body);
	posts
		.findOneAndUpdate(
			{ title: req.body.title },
			{
				$set: {
					content: req.body.content,
				},
			},
			{
				upsert: false,
			},
		)
		.then((result) => {
			console.log(result);
			res.json("Success");
		})
		.catch((error) => console.error(error));
});

app.delete("/posts", (req, res) => {
	console.log(req.body);
	posts
		.deleteOne({ title: req.body.title })
		.then((result) => {
			console.log(result);
			if (result.deletedCount === 0) {
				return res.json("No post to delete");
			}
			res.json("Success");
		})
		.catch((error) => console.error(error));
});

// App start
app.listen(3000, function () {
	console.log("listening on http://localhost:3000");
});
