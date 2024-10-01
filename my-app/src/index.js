import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login';
import Register from './Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Home from './Home';

// ReactDOM.render( 
//   <Router>
//     <Routes>
//       <Route path="/" element={<App />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//     </Routes>
//   </Router>,
//   document.getElementById('root')
// );
// THIS RENDER() FUNCTION IS DEPRECATED, SO WE NEED TO USE THE BELOW ONES

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
);

