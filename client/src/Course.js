import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/scss/recipes.scss';

export default function Course() {
  const [ recipes, setRecipes ] = useState(null)
  const [ isLoaded, setIsLoaded ] = useState(false)
  useEffect(() => {
    getData()
  },[])
  const getData = async () => {
    try {
      const data = await axios.get('/courses', {
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
  return (
    <div>
      <h1> Having > 1 course </h1>
      {isLoaded
      ? recipes.map((rec, index) => (
        <p key={index}>
          {rec.course}
        </p>
      ))
      : <div></div>}
    </div>
  )
}
