const express = require('express');
const recipeRouter = express.Router();
require("dotenv").config();
const client = require('./connectDatabase')

recipeRouter.get('/', (req, res) => {
  client.query(`
    SELECT r.name,
    r.by,
    r.description,
    r.course,
    r.cuisine,
    r.id,
    COUNT(t.rec_id) as "totalIngredients"
    FROM recipes as r
    INNER JOIN (
      SELECT rec_id
      FROM ingredientsToRecipes
    ) as t on r.id = t.rec_id
    GROUP BY r.id;
    `, (err, results) => {
    if(err) {
      throw err;
    }
    res.status(200).send(results)
  })
})

recipeRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    client.query(`
      SELECT ingredientsToRecipes.ing_id, ingredientsToRecipes.rec_id, ingredientsToRecipes.quantity, ingredientsToRecipes.quantity_unit, ingredients.name
      FROM ingredientsToRecipes
      JOIN ingredients
      ON ingredientsToRecipes.ing_id = ingredients.ing_id
      WHERE ingredientsToRecipes.rec_id = $1
      `, [id])
      .then(results => {
        console.log(results.rows[0])
        res.status(200).send(results)
      })
      .catch(err => console.error('Error executing query', err.stack))
})

recipeRouter.post('/', (req, res) => {
  const name = req.body.recipe.name;
  const by = req.body.recipe.by;
  const description = req.body.recipe.description;
  const ingredients = req.body.recipe.ingredients;
  const course = req.body.recipe.course;
  const cuisine = req.body.recipe.cuisine;
  client.query('INSERT INTO recipes (name, by, description, course, cuisine) VALUES ($1, $2, $3, $4, $5) RETURNING id', [name, by, description, course, cuisine])
    .then(results => {
      console.log(results.rows[0].id)
      const rec_id = results.rows[0].id;
      let ing_id;
      ingredients.map(item => {
        client.query('INSERT INTO ingredients (name) VALUES ($1) RETURNING ing_id', [item.name])
          .then(res => {
            ing_id = res.rows[0].ing_id;
            client.query('INSERT INTO ingredientsToRecipes (quantity, quantity_unit, rec_id, ing_id) VALUES ($1, $2, $3, $4)', [item.quantity, item.unit, rec_id, ing_id])
              .then(res => console.log(res.rows[0]))
              .catch(err => console.error('Error executing query', err.stack))
          }).catch(err => console.error('Error executing query', err.stack))
      })
    }).then(results => {
      return res.status(200).send(results)
    })
    .catch(err => console.error('Error executing query', err.stack))
})

recipeRouter.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.recipe.name;
  const by = req.body.recipe.by;
  const description = req.body.recipe.description;
  const course = req.body.recipe.course;
  const cuisine = req.body.recipe.cuisine;
  const ingredients = req.body.recipe.ingredients;
  const ing_id = req.body.recipe.ing_id;
  client.query(
    'UPDATE recipes SET name = $1, by=$2, description=$3, course=$4, cuisine=$5 WHERE id=$6;',
    [name, by, description, course, cuisine, id])
    .then(results => console.log("UPDATE recipes results", results))
    .catch(err => console.error('Error Executing Update recipes', err.stack))
    .then(() => {
      ingredients.map(ing => {
        const ingName = ing.name;
        const quantity = ing.quantity;
        const unit = ing.quantity_unit;
        const ingId = ing.ing_id;
        client.query(
          'UPDATE ingredients SET name=$1 WHERE ing_id=$2;', [ingName, ingId])
          .then(results => console.log("UPDATE ingredients results", results))
          .catch(err => console.error("Error Executing UPDATE ingredients", err))
          .then(() => {
            client.query(
              'UPDATE ingredientsToRecipes SET quantity=$1, quantity_unit=$2 WHERE ing_id=$3;',
              [quantity, unit, ingId])
              .then(results => console.log("UPDATE ingredientsToRecipes results", results))
              .catch(err => console.error('Error Executing UPDATE ingredientsToRecipes', err))
          })
    })
    return res.status(201).send("RECIPE UPDATED")
  })
})

recipeRouter.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  client.query('DELETE FROM recipes WHERE id = $1', [id], (err, results) => {
    if(err) {
      throw err;
    }
    res.status(200).send(`Recipe deleted with ID: ${id}`)
  })
})

module.exports = recipeRouter;
