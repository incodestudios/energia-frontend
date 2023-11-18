import React from 'react'

const LocalSearch = ({ keyword, setKeyword }) => {
  const handleSearchChange = (e) => {
    e.preventDefault()
    setKeyword(e.target.value.toLowerCase())
  }

  return (
    <input
      type="search"
      placeholder="Search"
      value={keyword}
      onChange={handleSearchChange}
      className="block w-full mb-4 px-4 py-2 mt-2 text-slate-700 bg-white border rounded-md focus:border-sky-500 focus:outline-none"
    />
  )
}

export default LocalSearch
