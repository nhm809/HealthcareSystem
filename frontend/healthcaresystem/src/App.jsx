import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import './assets/styles/main.scss'
import { ToastProvider } from './contexts/ToastProvider';
import { StoreProvider } from './contexts/StoreProvider';
import routers from './routers/routers';
import StaffLayout from './components/Layout/StaffLayout';
import ConsultantLayout from './components/Layout/ConsultantLayout';
import AdminLayout from './components/Layout/AdminLayout';
import ManagerLayout from './components/Layout/ManagerLayout';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <>
      <StoreProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Route staff: render StaffLayout directly */}
              <Route path="/staff" element={<StaffLayout />} />

              <Route path="/consultant" element= {<ConsultantLayout />}/>

              <Route path="/admin" element={<AdminLayout />} />

              <Route path="/manager" element={<ManagerLayout />} />

              {/* Member routes with default layout */}
              <Route element={
                <div className="App">
                  <Header />
                  <Suspense fallback={<Loading />}>
                    <Outlet />
                  </Suspense>
                  <Footer />
                </div>
              }>
                {routers
                  .filter(route =>
                    !route.path.startsWith('/staff') &&
                    !route.path.startsWith('/consultant') &&
                    !route.path.startsWith('/admin')
                  )
                  .map((route, index) => (
                    <Route key={index} path={route.path} element={<route.component />} />
                ))}
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </StoreProvider>
      <ChatbotWidget />
    </>
  );
}

export default App;