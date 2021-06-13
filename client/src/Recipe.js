import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/scss/recipe.scss';

export default function Recipe() {
  const recipeDetails = JSON.parse(localStorage.getItem('recipeDetails'))
  const data = JSON.parse(localStorage.getItem('recipeTable'))
  const [ isLoaded, setIsLoaded ] = useState(false)
  let params = useParams();
  useEffect(() => {
    getRecipe()
  })
  async function getRecipe () {
    try {
      var res = await axios.get(`/recipes/${params.id}`,{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      })
      localStorage.setItem('recipeDetails', JSON.stringify(res.data))
      setIsLoaded(true)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    isLoaded ?
      <div id="recipe-page">
        {isLoaded ? data.rows.filter(rec => rec.id == params.id).map(rec => (
          <section className="recipe-section" key={rec.id}>
            <h1> {rec.name} </h1>
            <p> <i>By:</i> {rec.by} </p>
            <p> {rec.description} </p>
          </section>
        )) : null}
        {recipeDetails ?
          recipeDetails.rows.map(item => (
            <section className="recipe-ingredients" key={item.ing_id}>
              <p> {item.quantity} {item.quantity_unit} {item.name} </p>
            </section>
          ))
        : null}
      </div>
    : <div></div>
  )
}
