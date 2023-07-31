const elasticSearch = require("@elastic/elasticsearch");
const dotenv = require("dotenv");
dotenv.config();

const elasticClient = new elasticSearch.Client({
  nodes: process.env.elasticLink,
  auth:{
    apiKey:{
        id: process.env.elasticId,
        api_key: process.env.elasticKey
    }
  }
});

const indexName = "productIndex";

//Function to define the properties of the index
async function createIndex() {
  try {
    const response = await elasticClient.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            productName: { type: "text" },
            productCategory: { type: "text" },
          },
        },
      },
    });

    console.log("Index created:", response);
  } catch (error) {
    console.log("Error creating index:", error.message);
  }
}

//Function to index the product data from the database
async function indexData(data) {
  try {
    for (const item of data) {
      await elasticClient.index({
        index: indexName,
        type: "_doc",  
        body: {
          name: item.name,
          description: item.description,
        },
      });
    }

    console.log("Data indexed successfully.");
  } catch (error) {
    console.log("Error indexing data:", error.message);
  }
}

//Function to search the indexed data
async function searchData(searchText) {
  try {
    const searchResults = await elasticClient.search({
      index: indexName,
      type: "_doc", 
      body: {
        query: {
          match: {
            description: searchText,
          },
        },
      },
    });

    const hits = searchResults.hits.hits;
    return hits;
  } catch (error) {
    console.log("Error performing search:", error.message);
    throw error;
  }
}

module.exports = { createIndex, indexData, searchData };
