import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const AddTeam = () => {
  const [teamData, setTeamData] = useState({
    team: '',
    gamesPlayed: '',
    win: '',
    draw: '',
    loss: '',
    goalsFor: '',
    goalsAgainst: '',
    points: '',
    year: '',
  });

  const handleChange = (e) => {
    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/football/add', teamData);
      alert('Team data added successfully!');
    } catch (error) {
      alert('Error adding team data');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
     
     <Header/>

      <main className="flex-grow bg-gray-50 py-10 mb-5">
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Team</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.keys(teamData).map((key) => (
              <div key={key} className="flex flex-col space-y-2">
                <label htmlFor={key} className="text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={teamData[key]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                  placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            >
              Add Team
            </button>
          </form>
        </div>
      </main>

     <Footer/>
    </div>
  );
};

export default AddTeam;
