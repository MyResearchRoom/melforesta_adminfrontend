import React, { useContext, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5';
import useHeader from '../hooks/useHeader';
import HeaderContext from '../context/headercontext';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../components/common/admin/changepassword';
import { savePassword } from '../services/savePassword';

export default function SettingPage() {
    const { header } = useContext(HeaderContext);
    useHeader("Setting");
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("adminuser"));
    const isSuperAdmin = storedUser?.role === "ADMIN";
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleOpenPasswordModal = () => {
        setIsPasswordModalOpen(true);
      };
    
    const handlePasswordChange = async (id, password,confirmPassword) => {
        const token = localStorage.getItem("token");
            try {
              await savePassword({ id,password,confirmPassword, token });
            } catch (err) {
              console.error("Save password failed:", err);
            }            
            setIsPasswordModalOpen(false);
      };
  return (
    <section className="pr-5 py-4">
        <div
            className="pb-2 flex flex-row space-x-2 items-center text-sm md:text-base xl:text-lg font-medium cursor-pointer"
            onClick={() => navigate(-1)}
        >
            <IoArrowBack />
            <p className="font-semibold">{header}</p>
        </div>
        <div className='flex items-center justify-center'>
        {isSuperAdmin && (
            <button 
                onClick={() => handleOpenPasswordModal()}
                className="px-3 py-2 border rounded-md border-primary text-primary bg-white text-sm xl:text-base font-semibold shadow-md hover:bg-custom-gradient1-hover hover:text-white">
                Change Password
            </button>
        )}
        </div>

        {isPasswordModalOpen && (
            <ChangePasswordModal
                id={storedUser?.id}
                closeModal={() => setIsPasswordModalOpen(false)}
                onPasswordChange={handlePasswordChange}
            />
        )}
    </section>
  )
}
