import React, { useEffect } from 'react';
import CreateRecipe  from './CreateRecipe';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Recipe from './Recipe';
import Nav from './Nav';
import Recipes from './Recipes';
import Course from './Course';
import axios from 'axios';
import './styles/scss/app.scss';

export default function App() {
  useEffect(() => {
    getData()
  }, [])
  async function getData() {
    try {
      await axios.get('/recipes', {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }).then(res => {
          localStorage.setItem('recipeTable', JSON.stringify(res.data));
      })
    }
    catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <Nav />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/create-recipe">
          <CreateRecipe />
        </Route>
        <Route path="/recipe/:id" children={<Recipe />}/>
        <Route path="/all-recipes">
          <Recipes />
        </Route>
        <Route path="/course">
          <Course />
        </Route>
      </Switch>
    </div>
  )
}
