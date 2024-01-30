const express = require('express')
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000; 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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

  //  Get All Data
    app.get('/allproducts', async (req, res) => {
      const result =await Products.find().toArray();
      res.send(result)
    })

  //  Get ID Data
  app.get('/product/:id', async(req,res)=>{
    const id=req.params.id;
    const query={_id : new ObjectId(id)}
    const result= await Products.findOne(query);
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