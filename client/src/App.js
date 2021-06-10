import React, { useEffect, useState } from 'react';
import CreateRecipe  from './CreateRecipe';
import axios from 'axios';
import './App.css';

export default function App() {
  const data = JSON.parse(localStorage.getItem('recipeTable'));
  const [recipeDetails, setRecipesDetails] = useState();
  const [ isLoaded, setIsLoaded ] = useState(false)
  useEffect(() => {
    if(!isLoaded) {
      getData();
    }
  })
  async function getData() {
    axios.get('/recipes', {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }).then(res => {
        localStorage.setItem('recipeTable', JSON.stringify(res.data));
        setIsLoaded(true);
    })
  }
  function handleClick(id) {
    axios.get(`/recipes/${id}`, {
      'params': {
        id: id
      },
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }).then(res => {
      console.log(res)
      setRecipesDetails(res.data);
    }).catch(err => console.log(err))
  }
console.log(data)
console.log(recipeDetails)
  return (
    <div className="App home-page">
      {(recipeDetails && recipeDetails.length > 0) ?
        recipeDetails.rows.map(item =>
          <div key={item.ing_id}>
            <p className="recipeDetails">
              Item:
              {item.quantity}
            </p>
            <p className="recipeDetails">
              Quantity:
              {item.quantity_unit}
            </p>
          </div>
        )
        : null}
      {isLoaded ? data.rows.map(rec => (
        <div className="recipe-container" key={rec.id}>
          <p className="recipe-name">
            {rec.name}
          </p>
          <p className="recipe-description">
            Description: <br />
            {rec.description}
          </p>
          <p className="recipe-author">
            Author: <br />
            {rec.by}
          </p>
          <button onClick={() => handleClick(rec.id)}> + Show more </button>
          {recipeDetails ?
            recipeDetails.rows.map(item => {
              if (item.rec_id === rec.id) {
                return (
                  <div>
                    <p className="recipeDetails">
                      {item.quantity} {item.quantity_unit} {item.name}
                    </p>
                  </div>
                )
              }
            })
          : null}
        </div>
      )) : null}
      <CreateRecipe />
    </div>
  )
}
