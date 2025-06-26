// src/App.jsx or src/Routes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WeatherFetcher from './components/WeatherFetcher'; // Predict page entry

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/predict" element={<WeatherFetcher />} />
      </Routes>
    </Router>
  );
}

export default App;
