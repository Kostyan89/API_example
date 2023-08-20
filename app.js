import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////////Requests Targetting all Articles/////////////////////////////////////////

app
  .route("/articles")
  .get(async (req, res) => {
    const foundArticles = await Article.find({});
    res.send(foundArticles);
  })
  .post(async (req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    await newArticle.save();
  })
  .delete(async (req, res) => {
    await Article.deleteMany({});
  });

//////////////////////////////////////////Requests Targetting A Specific Article/////////////////////////////////////////

app
  .route("/articles/:articleTitle")

  .get(async (req, res) => {
    const foundArticle = await Article.findOne({
      title: req.params.articleTitle,
    });
    res.send(foundArticle);
  })
  .put(async (req, res) => {
    const updatingArticle = await Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    );
    res.send();
  })
  .patch(async (req, res) => {
    const updatingArticle = await Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body }
    );
    res.send();
  })
  .delete(async (req, res) => {
    const deleteTitle = await Article.deleteOne({
      title: req.params.articleTitle,
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
