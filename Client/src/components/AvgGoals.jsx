import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const AvgGoals = () => {
  const [year, setYear] = useState('');
  const [goalThreshold, setGoalThreshold] = useState('');
  const [teams, setTeams] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year || !goalThreshold) {
      alert("Please fill in both fields.");
      return;
    }

    if (isNaN(year) || isNaN(goalThreshold)) {
      alert("Both year and goal threshold must be valid numbers.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/football/avg-goals/${year}/${goalThreshold}`);
      setTeams(response.data);
    } catch (error) {
      alert('Error fetching teams');
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Teams with Average Goals Greater Than</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Enter Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="goalThreshold" className="block text-sm font-medium text-gray-700">
              Enter Goal Threshold
            </label>
            <input
              type="number"
              id="goalThreshold"
              value={goalThreshold}
              onChange={(e) => setGoalThreshold(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Get Teams
          </button>
        </form>

        {teams.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">Teams with Average Goals Greater Than {goalThreshold}</h3>
            <ul>
              {teams.map((team) => (
                <li key={team._id} className="mb-2">
                  {team._id} - Average Goals: {team.avgGoalsFor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AvgGoals;
