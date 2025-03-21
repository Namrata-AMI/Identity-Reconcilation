const express = require("express");
const app = express();
const mongoose = require("mongoose");

const dbUrl = "mongodb://localhost:27017/ID_reconcilation"
const contactRouter = require("./routes/contact.js");

app.use(express.json());

app.use("/api" ,contactRouter);


// connect db fn //
main()
.then((res)=>{
    console.log("working db");
})
.catch((e)=>{
    console.log(e);
    console.log("db error");
})

async function main(){
    await mongoose.connect(dbUrl);
}

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});

