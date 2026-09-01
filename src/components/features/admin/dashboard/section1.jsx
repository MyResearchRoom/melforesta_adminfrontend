import React, { useContext, useEffect } from 'react'
import HeaderContext from '../../../../context/headercontext';
import useHeader from '../../../../hooks/useHeader';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { fetchLoggedUser } from '../../../../redux/actions/loggedUserActions';

export default function Section1() {
    const {header}=useContext(HeaderContext)
    useHeader("Dashboard");
    const navigate=useNavigate();
    const dispatch=useDispatch();
    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem("token");
        dispatch(fetchLoggedUser(token));  
      };
      fetchData();
    }, [dispatch]);
  return (
    <section className="flex flex-col justify-between text-sm md:text-base xl:text-xl ">
      <div className="pb-2 flex flex-row space-x-2 items-center text-sm md:text-base xl:text-lg font-medium" onClick={()=>navigate(-1)}>
            <IoArrowBack />
            <p className="font-semibold">{header}</p>
      </div>


    </section>
  )
}
