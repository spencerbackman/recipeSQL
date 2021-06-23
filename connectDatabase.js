const { Client } = require('pg');
require('dotenv').config();

let client;

const connectDatabase = () => {
  if(!client) {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
    client.connect(err => {
      if(!err) {
        console.log('Database is connected')
      } else {
        console.log('Error connecting database')
      }
    });
  }
  return client;
}

module.exports = connectDatabase();
