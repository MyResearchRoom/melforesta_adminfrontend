import { useContext } from "react";
import { HiMenu } from "react-icons/hi";
import SidebarContext from "../../context/sidebarContext";

export default function SidebarToggleButton() {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <button
      onClick={toggleSidebar}
      className="text-gray-700 text-2xl focus:outline-none"
      aria-label="Toggle Sidebar"
    >
      <HiMenu />
    </button>
  );
}
