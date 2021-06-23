import React, { useEffect, useState } from 'react';
import { useParams, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import './styles/scss/recipe.scss';

export default function Recipe() {
  const data = JSON.parse(localStorage.getItem('recipeTable'))
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ recipeIngredients, setRecipeIngredients ] = useState(null)
  const [ update, setUpdate ] = useState(false)
  const [ name, setName ] = useState()
  const [ description, setDescription ] = useState()
  const [ by, setBy ] = useState()
  const [ course, setCourse ] = useState('')
  const [ cuisine, setCuisine ] = useState('')
  const [ redirect, setRedirect ] = useState(false)
  let params = useParams();
  useEffect(() => {
    getData()
  },[])
  const getData = async () => {
    try {
      axios.get(`/recipes/${params.id}`,{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }).then(res => {
        setRecipeIngredients(res.data.rows)
        setIsLoaded(true)
        let recData = data.rows.filter(rec => rec.id === parseInt(params.id));
        setName(recData[0].name)
        setDescription(recData[0].description)
        setBy(recData[0].by)
        setCourse(recData[0].course)

        setCuisine(recData[0].cuisine)
      }).catch(err => console.log(err))
    } catch (err) {
      console.log(err)
    }
  }
  const handleDelete = () => {
    axios.delete(`/recipes/${params.id}`, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE'
    }).then(res => {
      console.log(res)
      setRedirect(true)
    })
  }
  const handleUpdate = e => {
    e.preventDefault()
    setUpdate(!update);
  }
  const updateRecipe = (e) => {
    e.preventDefault()
    const recipe = {
      name: name,
      by: by,
      description: description,
      course: course,
      cuisine: cuisine,
      ingredients: recipeIngredients
    }
    axios.put(`/recipes/${params.id}`,{recipe}).then(res => {
      console.log(res)
      window.location.reload()
    })
  }
  const handleIngredientChange = e => {
    const ingredients = [...recipeIngredients];
    ingredients[e.target.dataset.id][e.target.name] = e.target.value;
    setRecipeIngredients(ingredients)
  }
  const addIngredient = e => {
    e.preventDefault();
    setRecipeIngredients(prevIngredients => [...prevIngredients, {
      name: "",
      quantity: 0,
      quantity_unit: ""
    }])
  }
  return (
    isLoaded ?
      redirect ?
      <Redirect to={{ path:"/" }} />
      :
      <div id="recipe-page">
        {update ?
          <form id="recipe-form">
            <label htmlFor="name" className="form-label">
              Recipe Name <br />
              <input className="form-input"
                type="text"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)} />
            </label>
            <label htmlFor="description" className="form-label">
              Description <br />
              <input className="form-input"
                type="text"
                name="description"
                value={description}
                onChange={e => setDescription(e.target.value)} />
            </label>
            <label htmlFor="by" className="form-label">
              By <br />
              <input className="form-input"
                type="text"
                name="by"
                value={by}
                onChange={e => setBy(e.target.value)} />
            </label>
            <label htmlFor="course" className="form-label">
              Course <br />
              <select name="course" value={course} onChange={e => setCourse(e.target.value)}>
                <option value="Appetizer"> Appetizer </option>
                <option value="Breakfast"> Breakfast </option>
                <option value="Cocktail"> Cocktail </option>
                <option value="Dessert"> Dessert </option>
                <option value="Dinner"> Dinner </option>
                <option value="Lunch"> Lunch </option>
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
            <section>
              {recipeIngredients.map((item, index) => (
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
                    <input name="quantity_unit"
                      data-id={index}
                      type="text"
                      value={item.quantity_unit}
                      onChange={handleIngredientChange} />
                  </label>
                </div>
              ))}
            </section>
            <button id="submit-button" onClick={updateRecipe}> UPDATE RECIPE </button>
          </form>
        :
        <div>
        {isLoaded ? data.rows.filter(rec => rec.id === parseInt(params.id)).map(rec => (
          <section className="recipe-section" key={rec.id}>
            <h1> {rec.name} </h1>
            <p> <i>By:</i> {rec.by} </p>
            <p> {rec.description} </p>
            <p> {rec.course} </p>
            <p> {rec.cuisine} </p>
          </section>
        )) : null}
        {recipeIngredients ?
          recipeIngredients.map(item => (
            <section className="recipe-ingredients" key={item.ing_id}>
              <p> {item.quantity} {item.quantity_unit} {item.name} </p>
            </section>
          ))
        : null}
        <Link to="/">
          <button onClick={() => handleDelete()}> Delete Recipe </button>
        </Link>
        <button onClick={e => handleUpdate(e
        )}> Update Recipe </button>
      </div> }
     </div>
    : <div></div>
  )
}
