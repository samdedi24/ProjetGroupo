const express = require('express')
const path = require('path')
const cors = require('cors')

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')

const { sequelize } = require('./models/index')

const app = express()

app.use(cors())

app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);

const dbTest = async function () {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };
  dbTest();


module.exports = app;