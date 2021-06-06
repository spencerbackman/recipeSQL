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

// const Pool = require('pg').Pool;
// const pool = new Pool({
//   user: 'spencer',
//   host: 'localhost',
//   database: 'recipehub',
//   password: process.env.PASSWORD,
//   port: 5432
// })

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
    // pool.query('SELECT * FROM recipes WHERE id = $1', [id], (err, results) => {
    //   if(err) {
    //     throw err;
    //   }
    //   response.status(200).json(results.rows)
    // })
})

recipeRouter.post('/', (req, res) => {
  // const { name, by, date, cuisine } = req.body;
  const name = req.body.recipe.name;
  const by = req.body.recipe.by;
  const description = req.body.recipe.description;
  const ingredients = req.body.recipe.ingredients;
  console.log('INGREDIENTS!!!!!!!     ' + ingredients )
  client.query('INSERT INTO recipes (name, by, description) VALUES ($1, $2, $3) RETURNING id', [name, by, description])
    .then(res => {
      console.log(res.rows[0].id)
      const rec_id = res.rows[0].id;
      let ing_id;
      ingredients.map(item => {
        client.query('INSERT INTO ingredients (name) VALUES ($1) RETURNING ing_id', [item.name])
          .then(res => {
            console.log(res.rows[0].ing_id)
            ing_id = res.rows[0].ing_id;
            client.query('INSERT INTO ingredientsToRecipes (quantity, quantity_unit, rec_id, ing_id) VALUES ($1, $2, $3, $4)', [item.quantity, item.unit, rec_id, ing_id])
              .then(res => console.log(res.rows[0]))
              .catch(err => console.error('Error executing query', err.stack))
          })
          .catch(err => console.error('Error executing query', err.stack))
      })
    })
    .catch(err => console.error('Error executing query', err.stack))
  // ingredients.map(item => {
  //     pool.query('INSERT INTO ingredients (name) VALUES ($1) RETURNING ing_id', [item.name])
  //       .then(res => {
  //         console.log(res.rows[0].ing_id)
  //         ing_id = res.rows[0].ing_id
  //       })
  //       .catch(err => console.error('Error executing query', err.stack))
  //     pool.query('INSERT INTO ingredientsToRecipes (quantity, quantity_unit, rec_id, ing_id) VALUES ($1, $2, $3, $4)', [item.quantity, item.unit, rec_id, ing_id])
  //       .then(res => console.log(res.rows[0]))
  //       .catch(err => console.error('Error executing query', err.stack))
  // })


  // pool.query('
  //   INSERT INTO recipes (name, by, description)
  //   VALUES ($1, $2, $3)
  //   RETURNING id as rec_id
  //
  //   INSERT INTO ingredients (name)
  //   VALUES ($4)
  //   RETURNING ing_id
  //
  //   INSERT INTO ingredientsToRecipes (quantity, quantity_unit, rec_id, ing_id)
  //   VALUES ($5, $6, rec_id, ing_id);
  // ',
  // [name, by, description, ingredientName, ingredientQuantity, ingredientUnit],
  // (err, results) => {
  //   if(err) {
  //     throw err;
  //   }
  //   res.status(201).send(`Recipe added with ID: ${results}`)
  // })
})

// const getRecipes = (req, res) => {
//   pool.query('SELECT * FROM recipe', (err, results) => {
//     if(err) {
//       console.log(err)
//       throw err;
//     }
//     res.status(200).send(results);
//   })
// }
//
// const getRecipe = (req, res) => {
//   const id = parseInt(req.params.id)
//   pool.query('SELECT * FROM recipe WHERE id = $1', [id], (err, results) => {
//     if(err) {
//       throw err;
//     }
//     response.status(200).json(results.rows)
//   })
// }
//
//
// const createRecipe = (req, res) => {
//   const { name, by, date, cuisine } = req.body;
//
//   pool.query('INSERT INTO recipe (name, by, date, cuisine) VALUES ($1, $2, $3, $4)',
//   [name, by, date, cuisine],
//   (err, results) => {
//     if(err) {
//       throw err;
//     }
//     response.status(201).send(`Recipe added with ID: ${result.insertId}`)
//   })
// }
//
// const updateRecipe = (req, res) => {
//   const id = parseInt(req.params.id);
//   const { name, by, date, cuisine } = req.body;
//
//   pool.query('UPDATE recipes SET name = $1, by = $2, date = $3, cuisine = $4, id = $5',
//     [name, by, date, cuisine, id], (err, results) => {
//       if(err) {
//         throw err;
//       }
//       response.status(200).send(`User modified with ID: ${id}`)
//     })
// }
//
// const deleteRecipe = (req, res) => {
//   const id = parseInt(req.params.id);
//
//   pool.query('DELETE FROM recipes WHERE id = $1', [id], (err, results) => {
//     if(err) {
//       throw err;
//     }
//     response.status(200).send(`User deleted with ID: ${id}`)
//   })
// }

module.exports = recipeRouter;
