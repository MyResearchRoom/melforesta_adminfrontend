import { useEffect, useState } from 'react'
import './App.css'
import ScrollToTop from './components/common/scrollToTop'
import LoginPage from './components/layouts/login'
import AppRoutes from "./routes/appRoutes";
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Navigate, Route, Routes,} from 'react-router-dom';
import SidebarToggleButton from "./components/layouts/sidebarToggle";
import { SidebarProvider } from "./context/sidebarContext";
import Navbar from './components/layouts/navbar';
import Sidebar from './components/layouts/sidebar';
import { HeaderProvider } from './context/headercontext';
import VerifyOtpPage from './components/layouts/verifyOtp';
function AppLayout() {
  return (
    <HeaderProvider>
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-teal-50 to-red-50 h-auto overflow-y-auto no-scrollbar">
        <div className="">
          <Navbar />
        </div>
        
        <div className="flex flex-1 lg:hidden">
          <div className="w-[10%] md:w-[5%] pt-2">         
          <SidebarToggleButton />
          <Sidebar />   
           </div>      
          <div
            className="w-[90%] md:w-[95%] overflow-y-scroll max-h-screen h-auto relative pb-10 no-scrollbar"
          >
            <AppRoutes  />
          </div>
        </div>
       
        <div className="hidden lg:flex flex-1 relative "> 
          <div className="lg:w-[13%]">
            <Sidebar />  
          </div>        
                 
          <div
            className="w-full lg:w-[87%] overflow-y-auto max-h-screen h-auto relative pb-10 no-scrollbar"            
          >           
            <AppRoutes />
          </div>
        </div>
      </div>
    </SidebarProvider>
    </HeaderProvider>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("adminuser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("adminuser");
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />        
        <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/verify-otp" element={<VerifyOtpPage setUser={setUser} />} />

          {user  ? (
            <Route path="/*" element={<AppLayout />} />
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
        <ToastContainer 
          position="top-center" 
          autoClose={2000} 
          theme="light"
          style={{ fontSize: '16px', minHeight: '60px' }}/>
      </BrowserRouter>
    </div>
  )
}

export default App
