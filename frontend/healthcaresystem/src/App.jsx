import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Blog from './pages/Blog/BlogPage';
import BlogDetail from './pages/Blog/BlogDetail';
import OTPVerification from './components/Header/AuthModal/OTPVerfication';
import './assets/styles/main.scss'
import MainLayout from './components/Layout/Layout';
import Banner from './components/Banner/Banner'
import { ToastProvider } from './contexts/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <Router>
      <div className="App">
        <div>
          <Header />
        </div>
        
        {/* <div>
          <Banner/>
        </div> */}

        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path='/verify-otp' element={<OTPVerification />}/>
          </Routes> 
        </MainLayout>
        
        <div>
          <Footer />
        </div>  
      </div>
    </Router>
    </ToastProvider>
  );
}

export default App;