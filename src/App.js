import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <Router>

      <Dashboard />
    </Router>
  );
}

export default App;
