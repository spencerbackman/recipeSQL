import React, { useState, useEffect } from 'react';


export default function Recipes() {
  const arr = useDispatch(getRecipes());
  console.log(arr)
  return (
    <div>
    </div>
  )
}
