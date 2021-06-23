const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3300;
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "client", "build")))

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(cors());
app.use(morgan("dev"));

const corsOptions = {
  origin: 'http://localhost:3000'
}

const db = require('./queries');

app.use('/recipes', cors(), require('./queries'))
app.use('/courses', cors(), require('./courses'))
app.use('/ingredients', cors(), require('./ingredientQueries'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
