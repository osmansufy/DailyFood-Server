const express = require('express')
const app = express()
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const port =process.env.PORT || 5000
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config()
app.get('/', (req, res) => {
  res.send('Hello World!')
})
const serviceAccount = require("./hero-assignment-2e7cb-firebase-adminsdk-ymell-f0a4e61fa9.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hero-assignment-2e7cb-default-rtdb.firebaseio.com"
});
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5nuaz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err=>{
    const collection = client.db("ecommerceFullStack").collection("products");
    const orderCollection = client.db("ecommerceFullStack").collection("orders");
    console.log("database connected");
app.get('/orders',(req,res)=>{
    const bearer = req.headers.authorization;
  
    if (bearer && bearer.startsWith("Bearer ")) {
        const idToken=bearer.split(' ')[1]
    // idToken comes from the client app
admin
.auth()
.verifyIdToken(idToken)
.then((decodedToken) => {
  const uid = decodedToken.uid;
  const tokenEmail = decodedToken.email;
  const queryEmail = req.query.email;
  if (tokenEmail==queryEmail) {
      orderCollection.find({email:queryEmail})
      .toArray((err,documents)=>{
        res.status(200).send(documents)
      })
  }  else{
    res.status(401).send('un-authorized access')
}
})
.catch((error) => {
  // Handle error
});
    }
})
    app.post('/createOrder',(req,res)=>{
        const newOrder=req.body
        orderCollection.insertOne(newOrder)
        .then(result=>{
            console.log('inserted count', result.insertedCount);
            res.send("Order created successfully")
        })
    })
    app.get('/products', (req, res) => {
        collection.find()
        .toArray((err,items)=>{
            res.send(items)
        })
    })

    app.post('/addProduct',(req,res)=>{
        const newProduct = req.body;
        collection.insertOne(newProduct).then(result => {
            console.log('inserted count', result.insertedCount);
            res.send("Product uploaded successfully")
        })
    })
    app.get('/product/:id',(req,res)=>{
        collection.find({_id:ObjectID(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
    })
    app.delete('/deleteProduct/:id',(req,res)=>{
        const id =ObjectID(req.params.id);
        collection.findOneAndDelete({_id:id})
        .then(documents=>res.send(!!documents.value))
    })
    app.patch('/updateProduct/:id',(req,res)=>{
        const id=ObjectID(req.params.id);
        collection.updateOne({_id:id},{$set:{name:req.body.name,price:req.body.price,weight:req.body.weight}})
        .then(result=>res.send(result.modifiedCount > 0))
    })

})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})