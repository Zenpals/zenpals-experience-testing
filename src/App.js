import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthServiceCallback from './components/AuthServiceCallback'; // Import the new callback component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth-service-callback/" element={<AuthServiceCallback />} />
        {/* Add your other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
