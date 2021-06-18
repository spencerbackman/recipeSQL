import React, { useState } from 'react';
import { useInput } from './inputHook';
import { Redirect } from 'react-router-dom';
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
  const [ course, setCourse ] = useState('Appetizer');
  const [ cuisine, setCuisine ] = useState('American');
  const [ submitted, setSumbitted ] = useState(false);
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
      course: course,
      cuisine: cuisine,
      ingredients: ingredientList
    }
    axios.post('/recipes', { recipe }, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS'
    }).then(res => {
        console.log(res)
        setSumbitted(true)
      }).catch(err => console.error(err))
      resetName();
      resetBy();
      resetDescription();
      setCourse('Appetizer')
      setCuisine('Asian')
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
    submitted ?
      <Redirect to={{ path:"/" }} />
    :
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
        <label htmlFor="course" className="form-label">
          Course <br />
          <select value={course} onChange={e => setCourse(e.target.value)} name="course">
            <option value="Appetizer"> Appetizer </option>
            <option value="Breakfast"> Breakfast </option>
            <option value="Cocktail"> Cocktail </option>
            <option value="Dessert"> Dessert </option>
            <option value="Dinner"> Dinner </option>
            <option value="Lunch"> Lunch  </option>
            <option value="Other"> Other </option>
          </select>
        </label>
        <label htmlFor="cuisine" className="form-label">
          Cuisine <br />
          <select name="cuisine" value={cuisine} onChange={e => setCuisine(e.target.value)}>
            <option value="American"> American </option>
            <option value="Asian"> Asian </option>
            <option value="French"> French </option>
            <option value="Indian"> Indian </option>
            <option value="Italian"> Italian </option>
            <option value="Mediterranean"> Mediterranean </option>
            <option value="Mexican"> Mexican </option>
            <option value="Thai"> Thai </option>
            <option value="Other"> Other </option>
          </select>
        </label>
        <section id="ing-form">
        {ingredientList.map((item, index) => (
          <div key={index} className="ing-form-row">
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
