import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './styles/scss/home.scss';

export default function Home() {
  const [ recipes, setRecipes ] = useState(null);
  const [ redirect, setRedirect ] = useState(false);
  const [ id, setId ] = useState(null);
  useEffect(() => {
    getData()
  }, [])
  async function getData() {
    try {
      const data = await axios.get('/recipes', {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      })
      setRecipes(data.data.rows)
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleRowClick = (id) => {
    setId(id)
    setRedirect(true)
  }
  return (
    <div id="home-page">
      <table id="recipes-table">
        <thead>
          <tr>
            <th> Recipe Name </th>
            <th> Cuisine </th>
            <th> Course </th>
            <th> Author </th>
            <th> Total Ingredients </th>
          </tr>
        </thead>
        <tbody>
          {recipes ?
            recipes.map(rec => (
            <tr key={rec.id} onClick={() => handleRowClick(rec.id)}>
              <td> {rec.name} </td>
              <td> {rec.cuisine} </td>
              <td> {rec.course} </td>
              <td> {rec.by} </td>
              <td className="total"> {rec.totalIngredients} </td>
            </tr>
          )) : null}
        </tbody>
      </table>
      {redirect ?
        <Redirect to={`/recipe/${id}`} />
      : null}
    </div>
  )
}
