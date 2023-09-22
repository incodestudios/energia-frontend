import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './style.css'

const NotFound = () => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
          <h2>The page does not exist</h2>
        </div>
        <Link to="/" as={NavLink}>
          Go to home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
