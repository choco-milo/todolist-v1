const express = require("express")
const bodyParser = require("body-parser")
const { default: mongoose } = require("mongoose")
const date = require(__dirname + "/date.js")
const _ = require('lodash');
require("dotenv").config();


const port = process.env.PORT || 3000;



const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


mongoose.connect("mongodb+srv://admin-janice:" + process.env.DATABASE_PASSWORD + "@cluster0.dgkxfs3.mongodb.net/todolistDB");

const itemSchema =  new mongoose.Schema({
    name : String
})


const customeSchema = new mongoose.Schema({
    name : String,
    items : []
})

const Item = new mongoose.model("item", itemSchema)

const List = new mongoose.model("list", customeSchema)


const item1 = new Item({
    name : "Welcome to your todolist!"
})


const item2 = new Item({
    name : "Hit the + button to add a new item"
})

const item3 = new Item({
    name : "< -- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3]

app.get("/", async(req, res)=>{
    const bvalue = "default"
    const data = await Item.find({})
    if (data.length === 0){
        Item.insertMany(defaultItems)
        res.redirect("/")
        
    }else{
        res.render('list', {vday: date.getDate(),
            vitem : data,
            bvalue : bvalue})

    }
})



app.post("/", (req, res)=>{
    let item = req.body.newItem
    const button = req.body.button
    newItem = new Item({name : item})
    if (item === "" && button === "default"){
        res.redirect("/")
    }
    else if (item === "" && button !== "default"){
        res.redirect("/" + button)
    }
    else if (button === "default" ){
        newItem.save()
        res.redirect("/")
    }else{
        const results = (async () => {
            const foundList = await List.findOne({name: button}) 
            foundList.items.push(newItem)
            foundList.save()
        })()
        res.redirect("/" + button)
    }
    
   
})



app.get("/about", (req, res)=>{
    res.render("about")
})

app.post("/delete", async(req, res)=>{
    deleteItemId = req.body.checkbox
    const day = req.body.customdelete
    if (day === "default"){
        await Item.deleteOne({_id : deleteItemId})
        res.redirect("/")
    }else{
        const result = await List.findOne({ name: day });
       
        result.items = result.items.filter(element => element._id != deleteItemId);
      
        await result.save();
        
           res.redirect("/" + day)
        }
        
    })



app.get('/:anything', (req, res) => {
    const input =  _.capitalize(req.params.anything) 
    const bvalue = input
    const result = (async ()=>{
        const isin = await List.findOne({name : input})
    if (!isin){
        const list = new List({
            name : input,
            items : defaultItems
        })
        list.save()
        res.redirect("/" + input)
    }else{
        res.render('list', {vday: input,
            vitem : isin.items,
            bvalue: input})
    }
  })()
})



app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

