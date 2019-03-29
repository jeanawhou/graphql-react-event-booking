const express = require('express')
const graphqlHttp = require('express-graphql')

const mongoose = require('mongoose')
const graphqlResolvers = require('./graphql/resolvers/index')
const graphqlSchema = require('./graphql/schema/index')


const app = express()


app.use(express.json())
mongoose
  .connect(`mongodb+srv://${ process.env.MONGO_USER }:${ process.env.MONGO_PASSWORD }@cluster0-zbb6c.mongodb.net/${ process.env.MONGO_DB }?retryWrites=true`)
  .then(() => {
    app.listen(3000)
  })
  .catch(error => console.log(error))


app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}))
