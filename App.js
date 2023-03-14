const express = require("express");
const connectDB = require("./backend/config/mongoDb");
const Images = require("./backend/routes/Images")
const Occasions = require("./backend/routes/Occasion")
const Tags = require("./backend/routes/Tags")
const morgan = require("morgan");
const Category = require("./backend/routes/Category");
const Users = require("./backend/routes/Users");
const UserCategory = require("./backend/routes/UserCategory");
const UserSubCategory = require("./backend/routes/userSubCategory");
const holderTemplate = require("./backend/routes/HoldersTemplate");
const Posters = require("./backend/routes/Posters");
const cors = require("cors");
const generateUploadURL = require("./backend/s3");
const contact_list = require("./backend/routes/contact_list");


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
app.use("/contact_list", contact_list);

app.get('/s3Url',async(req,res)=>{
  const url = await generateUploadURL()
  res.send({url})
})


app.use(express.static("uploads"));


module.exports = app;