const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


// !mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot76b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // const teaCollection = client.db("teaDB").collection("tea");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const tea = client.db("teaDB");
    const teaCollection = tea.collection("tea");


    // ^ read single data

    app.get('/tea/:id',async(req,res)=>{
      const id = req.params.id
      // const query = {_id:new ObjectId(id) };
      const cursor=await teaCollection.findOne({_id:new ObjectId(id)})
      // const
      console.log(cursor)
      res.send(cursor)
    })


// ^read data

app.get('/tea',async(req,res)=>{
  const cursor = teaCollection.find();
  const newData = await cursor.toArray()
  res.send(newData)
})


// *post means => create
// *post data

app.post("/tea",async(req,res)=>{
  const newTea = req.body
  // console.log(newTea)
  
  const result = await teaCollection.insertOne(newTea);
  res.send(result)
  // console.log(result,'result in mongodb')
})



// ^update data
app.put('/tea/:id',async(req,res)=>{
  const id = req.params.id
  // console.log(id)

  const filter = { _id: new ObjectId(id) };
  // this option instructs the method to create a document if no documents match the filter
  const options = { upsert: true };
  
   const updateDoc = {
    $set: req.body
  };
  const result = await teaCollection.updateOne(filter, updateDoc, options);
  // console.log('update........',result )
  res.send(result)
})


//! delete data 
app.delete('/tea/:id',async(req,res)=>{
  const id = req.params.id
  // Query for a movie that has title "Annie Hall"
  const query = { _id:new ObjectId(id) };
  const result = await teaCollection.deleteOne(query);
  res.send(result)
  console.log("delete..........",result)
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/teas',(req,res)=>{
    // console.log('tea making is running')
    res.send([
      {
        "id": 1,
        "category": "Brewed Coffee",
        "slug": "brewed-coffee"
      },
      {
        "id": 2,
        "category": "Iced Coffee",
        "slug": "iced-coffee"
      },
      {
        "id": 3,
        "category": "Dessert Coffee",
        "slug": "dessert-coffee"
      }
    ])
})

app.listen(port,()=>{
    console.log(`tea making server is running on port: ${port}`)

})