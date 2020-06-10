'use strict';
const { graphql, buildSchema } = require('graphql')
//Schema
const schema = buildSchema(`
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
    product(id: ID!): Product
    order(id: ID!): Order
  }
`)

//DummyData
let products = [
  { id: 1, name: "Lapiz", price: "12"},
  { id: 2, name: "Borrador", price: "20"},
  { id: 3, name: "Cuaderno", price: "30"},
]

let orders = [
  { id: 1, customerName: "Raul", deliveryAddress: "Address1", productId: 1, quantity: 1},
  { id: 2, customerName: "Yeli", deliveryAddress: "Address2", productId: 2, quantity: 1},
  { id: 3, customerName: "Grecia", deliveryAddress: "Address3", productId: 2, quantity: 1},
]

// Resolvers
const resolvers = {
  product: ({ id }) => products.filter(product => product.id == id)[0],
  order: async ({ id }) => {
    const order = orders.filter(order => order.id == id)
    if (order.length == 0) return null
    return {
      ...order,
      product: () => products.filter(product => order.productId == id)[0]
    }
  }
}
module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
