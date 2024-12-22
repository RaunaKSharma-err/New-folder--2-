import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const TopTeams = () => {
  const [winValue, setWinValue] = useState('');
  const [teams, setTeams] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/football/top-teams', { win: winValue });
      setTeams(response.data);
    } catch (error) {
      alert('Error fetching teams');
    }
  };

  return (
    <>
  <Header/>
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Top Teams with Wins Greater Than</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="winValue" className="block text-sm font-medium text-gray-700">
          Enter Minimum Wins
        </label>
        <input
          type="number"
          id="winValue"
          value={winValue}
          onChange={(e) => setWinValue(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
        >
          Get Teams
        </button>
      </form>

      {teams.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Top Teams</h3>
          <ul>
            {teams.map((team) => (
              <li key={team.team} className="mb-2">
                {team.team} - Wins: {team.win}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <Footer/>
      </>
  );
};

export default TopTeams;
