const express = require("express");
const cors = require("cors");
const { createNewUser } = require("./controllers/createNewUser");
const { searchPhotoByQuery } = require("./controllers/searchPhotoByQuery");
const {
  searchHistoryByUserId,
} = require("./controllers/searchHistoryByUserId");
const {
  searchPhotoByTagAndSortBy,
} = require("./controllers/searchPhotoByTagAndSortBy");
const { savePhoto } = require("./controllers/savePhoto");
const { addTagsByPhotoId } = require("./controllers/addTagsByPhotoId");
const db = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/search/photos", searchPhotoByQuery);
app.get("/api/photos/tag/search", searchPhotoByTagAndSortBy);
app.get("/api/search-history", searchHistoryByUserId);

app.post("/api/users", createNewUser);
app.post("/api/photos", savePhoto);
app.post("/api/photos/:id/tags", addTagsByPhotoId);

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = { app };
