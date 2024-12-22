import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const TotalSummary = () => {
  const [year, setYear] = useState('');
  const [summary, setSummary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/football/summary/${year}`);
      setSummary(response.data);
    } catch (error) {
      alert('Error fetching summary');
    }
  };

  return (
    <>
    <Header/>
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Total Summary</h2>
      <form onSubmit={handleSubmit} className="mb-4">
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
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
        >
          Get Summary
        </button>
      </form>

      {summary && (
        <div className="mt-4">
          <p>Total Games Played: {summary[0]?.totalGamesPlayed}</p>
          <p>Total Wins: {summary[0]?.totalWins}</p>
          <p>Total Draws: {summary[0]?.totalDraws}</p>
        </div>
      )}
    </div>
    <Footer/>
          </>
  );
};

export default TotalSummary;
