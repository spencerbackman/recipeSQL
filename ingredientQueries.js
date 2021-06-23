const express = require('express');
const ingRouter = express.Router();
require("dotenv").config();
const client = require('./connectDatabase');

ingRouter.get('/', (req, res) => {
  client.query(`SELECT r.name, r.id,
    JSON_AGG (JSON_BUILD_OBJECT(
      'ing_id', i.ing_id,
      'name', i.name,
      'quantity', t.quantity,
      'quantity_unit', t.quantity_unit )) AS ingArray
    FROM recipes as r
    JOIN ingredientsToRecipes as t ON r.id = t.rec_id
    JOIN ingredients as i ON t.ing_id = i.ing_id
    GROUP BY r.name, r.id
    ORDER BY r.name`,
    (err, results) => {
    if(err) {
      console.log(err)
      throw err;
    }
    console.log(results)
    res.status(200).send(results);
  })
})

module.exports = ingRouter;
