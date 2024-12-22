import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddTeam from './components/AddTeam';
import UpdateTeam from './components/UpdateTeam';
import TotalSummary from './components/TotalSummary';
import DeleteTeam from './components/DeleteTeam';
import TopTeams from './components/TopTeams';
import AvgGoals from './components/AvgGoals';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center">Football Data Management</h1>
        <Routes>
          <Route path="/" element={<AddTeam />} />
          <Route path="/update" element={<UpdateTeam />} />
          <Route path="/summary" element={<TotalSummary />} />
          <Route path="/delete" element={<DeleteTeam />} />
          <Route path="/top-teams" element={<TopTeams />} />
          <Route path="/avg-goals" element={<AvgGoals />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
