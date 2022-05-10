const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
require('dotenv').config()

const app = express()


// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.va8my.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const inventoriCollection = client.db("warehouse-server").collection("inventory")

       app.get('/inventory', async(req, res)=> {
        const query ={}
        const cursor = inventoriCollection.find(query)
        const inventories = await cursor.toArray()
        res.send(inventories)
       })

       app.get('/inventory/:id', async(req, res) =>{
           const id = req.params.id
           const query={_id: ObjectId(id)}
           const inventory = await inventoriCollection.findOne(query)
           res.send(inventory)
       })

      // post
      
      app.post('/inventory', async(req, res) =>{
          const newInventory =req.body
          const result = await inventoriCollection.insertOne(newInventory)
          res.send(result)
      })

      // Delete
       app.delete('/inventory/:id',async(req, res)=>{
           const id =req .params. id;
           const query = {_id: ObjectId(id)}
           const result = await inventoriCollection.deleteOne(query)
           res.send(result);
       })

    }
    finally {

    }
}

run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Running server')
})

app.get('/hero',(req, res) =>{
    res.send('hero meets')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})

