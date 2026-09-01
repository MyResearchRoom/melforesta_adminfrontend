import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import routesdata from "../../routes/routesData";
import HeaderContext from "../../context/headercontext";
import SidebarContext from "../../context/sidebarContext";
import LogoutModal from "../../model/logoutModal";
import { FaTimes } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const { setHeader } = useContext(HeaderContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const user = JSON.parse(localStorage.getItem("adminuser"));
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleLogoutConfirm = () => {
    localStorage.removeItem("adminuser");
    // localStorage.removeItem("token");
    setHeader("");
    closeSidebar();
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`
        fixed lg:static
        top-0 left-0 
        z-50 lg:z-0 
        w-32 xl:w-40
        h-full bg-white border-r shadow-sm 
        transform transition-transform duration-300 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
        `}
      >
        <div className="relative"> 
        {isSmallScreen && (
          <div className="flex justify-end w-6 absolute right-0 top-2 lg:hidden">
            <button
              onClick={closeSidebar}
              className="text-2xl text-[#A63F40]  "
            >
              <FaTimes size={20}/>
            </button>
          </div>
        )}

        <nav className="overflow-y-auto h-full xl:px-2 pt-1 space-y-1">
          {routesdata
            .filter((item) => {
              if (!item.role) return true;
              if (Array.isArray(item.role)) {
                return item.role.includes(user?.role);
              }
              return item.role === user?.role;
            })
            .map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={(e) => {
                    if (item.title === "Log Out") {
                      e.preventDefault();
                      setIsLogoutModalOpen(true);
                    } else {
                      setHeader(item.title);
                      if (isSmallScreen) closeSidebar();
                    }
                  }}
                  className={`flex items-center gap-3 px-2 xl:px-3 py-2 text-sm lg:text-base rounded-lg transition-all duration-200 group
                    ${
                      isActive
                        ? "text-primary font-semibold bg-gray-200/80 shadow-md shadow-primary/20 border border-gray-300"
                        : "text-zinc-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
        </nav>
          </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
