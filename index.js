const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'p1',
  password: 'root',
});
let q="insert into user (id,username,email,password) values ?";
let  getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}
app.listen("8080",(req,res)=>{
  console.log("app is listening");
});
//HOME PAGE
app.get("/",(req,res)=>{
  let q="select count(*) from user"
  try{
    connection.query(q,(err,res1)=>{
      if(err) throw err;
      
      let count=res1[0]["count(*)"];
      res.render("home.ejs",{count});
    });
  }
  catch{
    res.send("some random error has occured");
  }
})
//DISPLAY PAGE
app.get("/user",(req,res)=>{
  let q="select * from user"
  try{
    connection.query(q,(err,res1)=>{
      if(err) throw err;
      
      // console.log(res1);
      res.render("showusers.ejs",{res1});
    });
  }
  catch{
    res.send("some random error has occured");
  }
})
//EDIT ROUTE
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  console.log("ID from URL:", id);
  let q = "SELECT * FROM user WHERE id = ?";
  connection.query(q, [id], (err, result) => {
      if (err) {
          console.log(err);
          return res.send("Database error");
      }
      console.log(result);
      res.render("edit.ejs",{user: result[0]})
  });
});
//Patch request for chaning username
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {username: formUser} =req.body;
  let q = "SELECT * FROM user WHERE id = ?";
  connection.query(q, [id], (err, result) => {
    if (err) {
        console.log(err);
        return res.send("Database error");
    }
    else{
        let q1="update user set username=? where id=?";
        connection.query(q1,[formUser,id],(err,result1)=>{
          if(err){
            console.log(err);
            return res.send("Database error");
          }
          else{
            res.redirect("/user");
          }
        })
    }
});
})