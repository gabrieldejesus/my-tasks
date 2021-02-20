const escapeHtml = require("escape-html");
const express = require("express");
const fs = require("fs");
const marked = require("marked");
const path = require("path");

const app = express();

// generate date now
const today = new Date();

// taskFake
const taskFake = {
  author: "Bruno Silva",
  assignee: "Gabriel de Jesus",
  task: "Make a subscribe page with authentication on GitHub",
  comments:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, dolorum excepturi ducimus dicta dolorem perspiciatis.",
  create_at:
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
};

// register .md as an engine in express view system
app.engine("md", function (path, options, fn) {
  fs.readFile(path, "utf8", function (err, str) {
    if (err) return fn(err);

    const html = marked.parse(str).replace(/\{([^}]+)\}/g, function (_, name) {
      return escapeHtml(options[name] || "");
    });

    fn(null, html);
  });
});

app.set("views", path.join(__dirname, "views"));

// make it the default so we dont need .md
app.set("view engine", "md");

// GET
app.get("/task", function (request, response) {
  response.render("task", {
    author: `Author: ${taskFake.author}`,
    assignee: `Assignee: ${taskFake.assignee}`,
    task: `Task: ${taskFake.task}`,
    comments: `Comments: ${taskFake.comments}`,
    created_at: `Created: ${taskFake.create_at}`,
  });
});

app.listen(3333);
console.log("✨  Server started on port 3333");
