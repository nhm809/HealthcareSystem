import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import './assets/styles/main.scss'
import { ToastProvider } from './contexts/ToastProvider';
import { StoreProvider } from './contexts/StoreProvider';
import routers from './routers/routers';

function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="App">
            <Header />
            <Suspense fallback={<Loading />}>
              <Routes>
                {routers.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={<route.component />}
                  />
                ))}
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </StoreProvider>
  );
}

export default App;