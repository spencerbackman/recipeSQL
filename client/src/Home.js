import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './styles/scss/home.scss';

export default function Home() {
  const data = JSON.parse(localStorage.getItem('recipeTable'));
  const [ redirect, setRedirect ] = useState(false);
  const [ id, setId ] = useState(null);

  const handleRowClick = (id) => {
    setId(id)
    setRedirect(true)
  }
  return (
    data ?
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
          {data.rows.map(rec => (
            <tr key={rec.id} onClick={() => handleRowClick(rec.id)}>
              <td> {rec.name} </td>
              <td> {rec.cuisine} </td>
              <td> {rec.course} </td>
              <td> {rec.by} </td>
              <td className="total"> {rec.totalIngredients} </td>
            </tr>
          ))}
        </tbody>
      </table>
      {redirect ?
        <Redirect to={`/recipe/${id}`} />
      : null}
    </div>
    : <div></div>
  )
}
