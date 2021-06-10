const express = require('express');
const recipeRouter = express.Router();
require("dotenv").config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

recipeRouter.get('/', (req, res) => {
  client.query('SELECT * FROM recipes', (err, results) => {
    if(err) {
      throw err;
    }
    res.status(200).send(results)
  })
})

recipeRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    client.query('SELECT ingredientsToRecipes.ing_id, ingredientsToRecipes.rec_id, ingredientsToRecipes.quantity, ingredientsToRecipes.quantity_unit, ingredients.name FROM ingredientsToRecipes JOIN ingredients ON ingredientsToRecipes.ing_id = ingredients.ing_id WHERE ingredientsToRecipes.rec_id = $1', [id])
      .then(results => {
        console.log(results.rows[0])
        res.status(200).send(results)
      })
      .catch(err => console.error('Error executing query', err.stack))
})

recipeRouter.post('/', (req, res) => {
  // const { name, by, date, cuisine } = req.body;
  const name = req.body.recipe.name;
  const by = req.body.recipe.by;
  const description = req.body.recipe.description;
  const ingredients = req.body.recipe.ingredients;
  client.query('INSERT INTO recipes (name, by, description) VALUES ($1, $2, $3) RETURNING id', [name, by, description])
    .then(res => {
      console.log(res.rows[0].id)
      const rec_id = res.rows[0].id;
      let ing_id;
      ingredients.map(item => {
        client.query('INSERT INTO ingredients (name) VALUES ($1) RETURNING ing_id', [item.name])
          .then(res => {
            ing_id = res.rows[0].ing_id;
            client.query('INSERT INTO ingredientsToRecipes (quantity, quantity_unit, rec_id, ing_id) VALUES ($1, $2, $3, $4)', [item.quantity, item.unit, rec_id, ing_id])
              .then(res => console.log(res.rows[0]))
              .catch(err => console.error('Error executing query', err.stack))
          })
          .catch(err => console.error('Error executing query', err.stack))
      })
    })
    .catch(err => console.error('Error executing query', err.stack))
})

recipeRouter.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  client.query('DELETE FROM recipes WHERE id = $1', [id], (err, results) => {
    if(err) {
      throw err;
    }
    response.status(200).send(`Recipe deleted with ID: ${id}`)
  })
})

module.exports = recipeRouter;
