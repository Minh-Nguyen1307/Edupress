import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import HomePage from './Pages/HomePage/HomePage';
import SignUpPage from './Pages/SignUpPage/SignUpPage';
import SignInPage from './Pages/SignInPage/SignInPage';



function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </Router>
    
  );
}

export default App;