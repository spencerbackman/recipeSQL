import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './styles/scss/home.scss';

export default function Home() {
  const data = JSON.parse(localStorage.getItem('recipeTable'));
  const [ redirect, setRedirect ] = useState(false);
  const [ id, setId ] = useState(null);
  const handleRowClick = (e, id) => {
    setId(id)
    setRedirect(true)
  }
  return (
    <div id="home-page">
      <table id="recipes-table">
        <thead>
          <tr>
            <th> Recipe Name </th>
            <th> Description </th>
            <th> Author </th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map(rec => (
            <tr key={rec.id} onClick={(e) => handleRowClick(e, rec.id)}>
              <td> {rec.name} </td>
              <td> {rec.description} </td>
              <td> {rec.by} </td>
            </tr>
          ))}
        </tbody>
      </table>
      {redirect ?
        <Redirect to={`/recipe/${id}`} />
      : null}
    </div>
  )
}
