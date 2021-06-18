import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/scss/recipe.scss';

export default fuction UpdateRecipe() {
  const [ recipe, setRecipe ] = useState({
    name: '',
    description: '',
    by: '',
    course: '',
    cuisine: '',
    ingredients: [{
      name: '',
      quantity: '',
      quantity_unit: ''
    }]
  })
  useEffect(() => {

  })
  const handleChange = e => {
    const rec = [...recipe];
    rec[e.target.name] = e.target.value;
    setRecipe(rec);
  }
  const handleIngredientChange = e => {
    const ingredients = [...recipeIngredients];
    ingredients[e.target.dataset.id][e.target.name] = e.target.value;
    setRecipeIngredients(ingredients)
  }
}
