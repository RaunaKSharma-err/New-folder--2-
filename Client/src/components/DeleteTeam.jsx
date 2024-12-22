import React, { useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import Header from './Header';

const DeleteTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/football/delete', { team: teamName });
      setMessage('Team deleted successfully!');
    } catch (error) {
      setMessage('Error deleting team');
    }
  };

  return (
  <>
  <Header/>
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Delete Team</h2>
      <form onSubmit={handleDelete}>
        <div className="mb-4">
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Team
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
    <Footer/>
            </>
  );
};

export default DeleteTeam;
