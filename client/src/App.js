import CreateRecipe  from './CreateRecipe';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Recipe from './Recipe';
import Nav from './Nav';
import Recipes from './Recipes';
import Course from './Course';
import './styles/scss/app.scss';

export default function App() {
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
