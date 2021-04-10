const express = require("express");
const fs = require("fs");
const db = require("./database.json");
const app = express();
app.use(express.json({ extended: true }));

// ! Basic CRUD operations
// ! CREATE posts
app.use("/api/create-post", (request, response, next) => {
  // console.log(request.body);
  const newDb = [request.body, ...db];
  fs.writeFileSync(`${__dirname}/database.json`, JSON.stringify(newDb));
  response.status(201).send({ created: true });
});
// ! RETRIEVE posts
app.use("/api/get-posts", (request, response, next) => {
  response.send(db);
});
// ! UPDATE posts
app.use("/api/update-post", (request, response, next) => {
  var findIndex = db.find((item) => item._id == request.body._id);
  findIndex = db.indexOf(findIndex);
  db[findIndex] = request.body;
  fs.writeFileSync(`${__dirname}/database.json`, JSON.stringify(db));
  response.status(202).send({ updated: true });
});
// ! DELETE posts
app.use("/api/delete-post", async (request, response, next) => {
  var findIndex = db.find((item) => item._id == request.body._id);
  if (findIndex) {
    findIndex = db.indexOf(findIndex);
    db.splice(findIndex, 1);
    await fs.writeFileSync(`${__dirname}/database.json`, JSON.stringify(db));
    await response.status(202).send({ deleted: true });
  } else {
    response.send({ deleted: false });
  }
});
app.listen(5000);
