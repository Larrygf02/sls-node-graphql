'use strict';
const { graphql } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')
//Schema
const tyDefs = `
  type Product {
    id: ID!
    name: String!
    price: String!
  }

  type Order {
    id: ID!
    customerName: String!
    deliveryAddress: String!
    product: Product!
    quantity: Int!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
    order(id: ID!): Order
  }
`
//DummyData
let products = [
  { id: 1, name: "Lapiz", price: "12"},
  { id: 2, name: "Borrador", price: "20"},
  { id: 3, name: "Cuaderno", price: "30"}
]

let orders = [
  { id: 1, customerName: "Raul", deliveryAddress: "Address1", productId: 1, quantity: 1},
  { id: 2, customerName: "Yeli", deliveryAddress: "Address2", productId: 2, quantity: 1},
  { id: 3, customerName: "Grecia", deliveryAddress: "Address3", productId: 2, quantity: 1}
]

// Resolvers
const resolvers = {
  Query: {
    products: () => {
      return products;
    },
    product: (_, { id }) => {
      console.log('ID product', id)
      let product = products.filter(p => p.id == id)
      if (product.length == 0) return null 
      return product[0]
    },
    order: async (_ ,{ id }) => {
      let order = orders.filter(order => order.id == id)
      if (order.length == 0) return null
      order = order[0]
      const product = products.filter(p => p.id == order.productId)[0]
      const data = {
        ...order,
        product
      }
      return data
    }
  }
}

const graphqlSchema =  makeExecutableSchema({
  typeDefs: tyDefs,
  resolvers
})

function get_query(event) {
  var query = null;
  let body = JSON.parse(event.body);
  if (body.query) {
    query = body.query
  }else{
    throw new Error('No parameter query')
  }
  return query
}

module.exports.query_graphql = async event => {
  const query = get_query(event)
  console.log("query", query)
  const result = await graphql(graphqlSchema, query)
  console.log(result)
  return {
    statusCode: 200,
    body: JSON.stringify(
      result.data,
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
