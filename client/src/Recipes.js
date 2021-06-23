import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/scss/recipes.scss';

export default function Recipes() {
  const [ recipes, setRecipes ] = useState(null);
  const [ isLoaded, setIsLoaded ] = useState(false)
  useEffect(() => {
    getData()
  },[])
  const getData = async () => {
    try {
      const data = await axios.get('/ingredients', {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET'
          })
        console.log(data)
        setRecipes(data.data.rows)
        setIsLoaded(true)
    } catch (err) {
      console.log(err)
    }
  }
  console.log(recipes)
  return (
    isLoaded
    ? recipes.map(ing => (
      <div key={ing.id} id="all-recipes">
          <p className="recipes-name"> {ing.name} </p>
          {ing.ingarray.map(ingredient => (
            <p key={ingredient.ing_id}> {ingredient.quantity} {ingredient.quantity_unit} {ingredient.name} </p>
          ))}
          <br />
      </div>
    ))
    : <div></div>
  )
}
