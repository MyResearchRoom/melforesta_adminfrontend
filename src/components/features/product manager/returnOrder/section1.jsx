import React, { useContext } from 'react'
import HeaderContext from '../../../../context/headercontext';
import useHeader from '../../../../hooks/useHeader';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

export default function Section1() {
    const {header}=useContext(HeaderContext)
    useHeader("Returned Orders");
    const navigate=useNavigate();
  return (
    <section className="flex flex-col md:flex-row justify-between text-sm md:text-base xl:text-xl ">
        <div className="flex flex-row space-x-2 items-center text-sm md:text-base xl:text-lg font-medium" onClick={()=>navigate(-1)}>
            <IoArrowBack />
            <p className="font-semibold">{header}</p>
        </div>
    </section>
  )
}
