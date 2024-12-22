import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const UpdateTeam = () => {
  const [teamData, setTeamData] = useState({
    team: '',
    year: '',
    gamesPlayed: '',
    win: '',
    draw: '',
    loss: '',
    goalsFor: '',
    goalsAgainst: '',
    points: '',
  });

  const handleChange = (e) => {
    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/football/update', teamData);
      alert('Team data updated successfully!');
    } catch (error) {
      alert('Error updating team data');
    }
  };

  return (
    <>
    <Header/>
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md mb-20">
      <h2 className="text-xl font-semibold mb-4">Update Team</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="team" className="block text-sm font-medium text-gray-700">
            Team Name
          </label>
          <input
            type="text"
            id="team"
            name="team"
            value={teamData.team}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {Object.keys(teamData)
          .filter((key) => key !== 'team')
          .map((key) => (
            <div key={key} className="mb-4">
              <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={teamData[key]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Update Team
        </button>
      </form>
    </div>
    <Footer/>
                </>
  );
};

export default UpdateTeam;
