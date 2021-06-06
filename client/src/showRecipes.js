import React from 'react';





export default function ShowRecipes() {
    return(
      <div></div>
    )
}

// export default function ShowRecipes() {
//     const data = JSON.parse(localStorage.getItem('recipeTable'));
//     return(
//       <table>
//         <tbody>
//           {data.data.map(res => (
//             <tr key={res.id}>
//               <tb>
//                 {res.name}
//               </tb>
//               <tb>
//                 {res.by}
//               </tb>
//               <tb>
//                 {res.date}
//               </tb>
//               <tb>
//                 {res.cuisine}
//               </tb>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     )
// }
