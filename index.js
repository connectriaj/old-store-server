const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
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

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
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
