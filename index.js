const express = require('express')
const app = express();
const dotenv = require('dotenv').config();
const cors = require("cors");
var cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(express.json());
app.use(cors('http://localhost:5173/'));
app.use(cookieParser())


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.dhtqvw7.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const Products = client.db("tea-and-coffee").collection("allproducts");
    const AllUsers = client.db("tea-and-coffee").collection("alluser");
    const ProductCart = client.db("tea-and-coffee").collection("productcart");
    const userPurchaseProduct = client.db("tea-and-coffee").collection("purchaseproduct");
    const allPurchaseProduct = client.db("tea-and-coffee").collection("allpurchaseproduct");

    //  Get All Data
   

    app.get('/allproducts', async (req, res) => {
      const result = await Products.find().toArray();
      res.send(result)
    })

    //  Get ID Data
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await Products.findOne(query);
      res.send(result)
    })
// get 6 data
app.get('/lastedproduct',async(req,res)=>{
  const result= await Products.find().limit(6).sort({count: -1}).toArray();
  res.send(result);
 })

    app.delete('/deleteproduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Products.deleteOne(query);
      res.send(result)
    })

    app.post('/addproduct', async (req, res) => {
      const document = req.body;
      const result = await Products.insertOne(document)
      res.send(result)
    })
    // ALL USERS
    app.post("/addnewuser",async(req,res)=>{
      const document = req.body;
      const result = await AllUsers.insertOne(document);
      res.send(result)
    })
    app.get("/alluser",async(req,res)=>{
      const result=await AllUsers.find().toArray();
      res.send(result)
    })

    // Add To Cart
    app.post('/addcartproduct', async (req, res) => {
      const document = req.body;
      const result = await ProductCart.insertOne(document);
      res.send(result)
    })
    app.get('/cartdata', async (req, res) => {
      const result = await ProductCart.find().toArray();
      res.send(result)
    })
    // Add To Cart
// User Purchase Product
 app.post("/adduserproduct",async(req,res)=>{
  const document =req.body;
  const result=await userPurchaseProduct.insertOne(document);
  res.send(result)
 })
 app.get('/userpurchaseproduct',async(req,res)=>{
  const result=await userPurchaseProduct.find().toArray();
  res.send(result)
 })
 app.post("/allpurchaseproduct",async(req,res)=>{
  const document = req.body;
  const result =await allPurchaseProduct.insertOne(document);
  res.send(result)
 })
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello world')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})