const express = require("express");
const connectDB = require("./config/mongoDb");
const Images = require("./routes/Images")
const Occasions = require("./routes/Occasion")
const Tags = require("./routes/Tags")
const morgan = require("morgan");
const Category = require("./routes/Category");
const Users = require("./routes/Users");
const UserCategory = require("./routes/UserCategory");
const UserSubCategory = require("./routes/userSubCategory");
const holderTemplate = require("./routes/HoldersTemplate");
const Posters = require("./routes/Posters");
const cors = require("cors");
const generateUploadURL = require("./s3");


app = express();
app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  
app.use(express.json());
connectDB()
app.use(morgan("dev"));

app.use("/images", Images);
app.use("/occasions", Occasions);
app.use("/categories", Category);
app.use("/tags", Tags);
app.use("/users", Users);
app.use("/userCategory", UserCategory);
app.use("/userSubCategory", UserSubCategory);
app.use("/holderTemplate", holderTemplate);
app.use("/posters", Posters);

app.get('/s3Url',async(req,res)=>{
  const url = await generateUploadURL()
  res.send({url})
})


app.use(express.static("uploads"));

module.exports = app;