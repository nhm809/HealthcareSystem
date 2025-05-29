import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Blog from './pages/Blog/BlogPage';

function App() {
  return (
    <Router>
      <div className="App">

        <div>
          <Header />
        </div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>

        <div>
          <Footer />
        </div>  
      </div>
    </Router>
  );
}

export default App;