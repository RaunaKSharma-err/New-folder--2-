import React from 'react'

const Header = () => {
  return (
    <>
     <header className="bg-blue-600 text-white py-4 mb-2">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Football Management</h1>
          <nav className="space-x-6">
            <a href="/" className="hover:text-blue-300">Add-Teams</a>
            <a href="/delete" className="hover:text-blue-300">Delete-Teams</a>
            <a href="/avg-goals" className="hover:text-blue-300">Avg-Goals</a>
            <a href="/top-teams" className="hover:text-blue-300">Top-Teams</a>
            <a href="/summary" className="hover:text-blue-300">Total-Summary</a>
            <a href="/update" className="hover:text-blue-300">Update-Teams</a>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header