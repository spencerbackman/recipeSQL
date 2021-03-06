import { Link } from 'react-router-dom';
import './styles/scss/nav.scss';

export default function Nav () {
  return (
    <div className="navbar">
      <Link className="nav-link-holder" to="/">
        <p className="nav-link">
          RECIPES
        </p>
      </Link>
      <Link className="nav-link-holder" to="/create-recipe">
        <p className="nav-link">
          CREATE RECIPE
        </p>
      </Link>
      <Link className="nav-link-holder" to="/all-recipes">
        <p className="nav-link">
          ALL RECIPES
        </p>
      </Link>
      <Link className="nav-link-holder" to="/course">
        <p className="nav-link">
          COURSES
        </p>
      </Link>
    </div>
  )
}
