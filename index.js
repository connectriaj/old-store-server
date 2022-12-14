const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
// for handle post api middle ware
app.use(express.json());

// mongoDB client connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l85wmee.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("oldStore").collection("products");
    const orderCollection = client.db("oldStore").collection("orders");
    const userCollection = client.db("oldStore").collection("users");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.get("/product/:category_id", async (req, res) => {
      const id = req.params.category_id;
      const query = { category_id: id };
      const service = await serviceCollection.find(query).toArray();
      res.send(service);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const orders = await orderCollection.find(query).toArray();
      res.send(orders);
    });

    // users collection api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
      
      
      
  } finally {
    // nothing to do here
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Old Store server is running");
});

app.listen(port, () => {
  console.log(`old store server is running port: ${port}`);
});
