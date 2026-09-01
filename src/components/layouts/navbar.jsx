import { useMemo, useState, useRef, useEffect, } from "react";
import { CgProfile } from "react-icons/cg";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../../model/logoutModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoggedUser } from "../../redux/actions/loggedUserActions";
import { Logo } from "../../assets/common";
export default function Navbar() 
{
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate=useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dispatch=useDispatch();

  const { user, error } = useSelector(
    (state) => state.loggedUserState
  );

  useEffect(() => {
    const fetchData = async () => {
        if(!user){
          const token = localStorage.getItem("token")
          dispatch(fetchLoggedUser(token)); 
        }      
    };
    fetchData();
  }, [dispatch,user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("adminuser");
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  {error && (
  <p className="text-red-600">
    {typeof error === "string" ? error : error.message || "Something went wrong"}
  </p>
  )}

  return (
    <div className="w-full bg-primary h-auto px-4 py-1 text-white">
      <div className="flex flex-row justify-between items-center">
        <div className="text-base md:text-lg xl:text-xl font-bold tracking-wide flex flex-row gap-2 items-center">      
          <div className=" bg-white  rounded-lg p-1">
            <img src={Logo} alt="Mel Foresta" className="w-20 md:w-24 object-contain h-14" />
            
          </div>
          {/* <span className="text-white">MelForesta</span> */}
        </div>

        <div ref={dropdownRef} className="relative">
          <div
            className="flex flex-row items-center space-x-2 cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            {user?.profile ? (
              <img
                src={user.profile}
                alt="Profile Picture"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <CgProfile className="text-white text-3xl lg:text-4xl" />
            )}

            <div className="flex flex-col justify-between text-xs lg:text-sm capitalize">
              <p>{user?.name}</p>
              <p className="text-xs">{user?.role}</p>
            </div>

            <FaChevronDown
              className={`text-white text-sm xl:text-base transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {open && (
            <div className="absolute border border-primary right-5 mt-0 w-28 p-2 bg-white text-black rounded-lg shadow-lg py-2 z-50 text-sm">
              <button 
                onClick={()=>{navigate("/profile"),setOpen(false)}}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:border hover:border-gray-500 rounded-md">
                Profile
              </button>
              <button 
                 onClick={()=>{navigate("/setting"),setOpen(false)}}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:border hover:border-gray-500 rounded-md">
                Settings
              </button>
              <button
                onClick={() =>{setIsLogoutModalOpen(true),setOpen(false)}}
                className="block w-full text-left px-4 py-2 text-red-500  hover:bg-red-100 hover:border hover:border-red-500 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

          <LogoutModal
              isOpen={isLogoutModalOpen}
              onClose={() => setIsLogoutModalOpen(false)}
              onConfirm={handleLogoutConfirm}
          />
    </div>
  );
}
