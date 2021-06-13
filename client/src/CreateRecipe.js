import React, { useState } from 'react';
import { useInput } from './inputHook';
import axios from 'axios';
import './styles/scss/createRecipe.scss';

const defaultIngredientList = [
  {
    name: "",
    quantity: "",
    unit: ""
  }
]

export default function CreateRecipe() {
  const [ ingredientList, setIngredientList ] = useState(defaultIngredientList);
  const { value: name, bind:bindName, reset:resetName } = useInput('');
  const { value: by, bind: bindBy, reset: resetBy } = useInput('');
  const { value: description, bind: bindDescription, reset: resetDescription } = useInput('');
  // const [ name, setName ] = useState('');
  // const [ by, setBy ] = useState('');
  // const [ description, setDescription ] = useState('');
  const handleIngredientChange = e => {
    const ingredients = [...ingredientList];
    ingredients[e.target.dataset.id][e.target.name] = e.target.value;
    setIngredientList(ingredients);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const recipe = {
      name: name,
      by: by,
      description: description,
      ingredients: ingredientList
    }
    axios.post('/recipes', { recipe }, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS'
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => console.error(err))
      resetName();
      resetBy();
      resetDescription();
      setIngredientList(defaultIngredientList);
  }
  const addIngredient = e => {
    e.preventDefault()
    setIngredientList(prevIngredients => [...prevIngredients, {
        name: "",
        quantity: 0,
        unit: ""
    }])
  }
  return (
    <div id="create-recipe-page">
      <form id="recipe-form">
        <label htmlFor="name" className="form-label">
          Recipe Name <br />
          <input className="form-input" type="text" name="name" {...bindName}/>
        </label>
        <label htmlFor="description" className="form-label">
          Description <br />
        <textarea className="form-input" type="text" name="description" {...bindDescription} />
        </label>
        <label htmlFor="by" className="form-label">
          Name <br />
          <input className="form-input" type="text" name="by" {...bindBy} />
        </label>
        <section id="ing-form">
        {ingredientList.map((item, index) => (
          <div key={index}>
            <label htmlFor="ingredientName">
              Ingredient
              <input name="name"
                data-id={index}
                type="text"
                value={item.name}
                onChange={handleIngredientChange} />
            </label>
            <label htmlFor="quantity">
              Quantity
              <input name="quantity"
                data-id={index}
                type="number"
                value={item.quantity}
                onChange={handleIngredientChange} />
            </label>
            <label htmlFor="unit">
              Unit
              <input name="unit"
                data-id={index}
                type="text"
                value={item.unit}
                onChange={handleIngredientChange} />
            </label>
          </div>
        ))}
          <button onClick={addIngredient}> + Add Ingredient </button>
        </section>
        <button id="submit-button" onClick={handleSubmit}>
          SUBMIT
        </button>
      </form>
    </div>
  )
}
