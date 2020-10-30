const express = require("express");
const elasticsearch = require("elasticsearch");
const app = express();
app.use(express.json());

const esClient = elasticsearch.Client({
  host: "http://127.0.0.1:9200",
});

app.post("/products", async (req, res) => {
  try {
    const response = await esClient.index({
      index: "products",
      body: {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      },
    });
    console.log(response);
    return res.json({ message: "Indexing successful" });
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const response = await esClient.search({
      index: "products",
      body: {
        query: {
          match: {
            name: req.query.text.trim(),
          },
        },
      },
    });
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ message: "Error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("connected");
});
