const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
mongoose.set("strictQuery", false);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-devang:test123@devang.oekcaxq.mongodb.net/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "welcome to your todo list",
});

const item2 = new Item({
  name: "hit the pluse " + " icon",
});

const item3 = new Item({
  name: "and write your today tasks",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {

  Item.find({}, function (err, foundItems) {
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("succesfully inserted in document");
        }
        res.redirect("/")
      });
    }else{
      res.render("list", { newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  
  const itemName =req.body.newItem;

  const item = new Item({
    name:itemName
  })

  item.save();
  res.redirect("/");

});

app.post("/delete",function(req,res){
  const checkedbox = (req.body.checkbox);

  Item.findByIdAndRemove(checkedbox,function(err){
    if(!err){
      console.log("sussecfully deleted checked box.")
      res.redirect("/")
    }
  })
})

let port  = process.env.PORT;
if(port == null || port == "" ){
  port = 3000;
}

app.listen(port, function () {
  console.log("server stared succesfully ");
});
