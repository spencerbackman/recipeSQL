const express = require('express');
const router = express.Router();
require("dotenv").config();
const client = require('./connectDatabase');

router.get('/', (req, res) => {
  client.query(`
    SELECT course
    from recipes
    GROUP BY course
    HAVING COUNT(course) > 0;`,
    (err, results) => {
    if(err) {
      console.log(err)
      throw err;
    }
    console.log(results)
    res.status(200).send(results);
  })
})

router.get('/')

module.exports = router;
