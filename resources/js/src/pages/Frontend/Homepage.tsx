import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
// import ReactApexChart from '../react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import { FormSubmitHandler } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useLazyGetContainersQuery } from '../../api/api';
import collect from 'collect.js';
import dayjs from 'dayjs';

const Index = () => {
    // const theme = useTheme();
    const resultsRef = useRef<HTMLDivElement>(null);
    const [trigger, { data, isFetching, error }] = useLazyGetContainersQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Shipping Container Tracking'));
        if (data && resultsRef.current) {
            resultsRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }, [data]);
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const formSubmit:React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.currentTarget).entries());
        
        trigger(formData);
    }
    const handletrackingNumberChange:React.ChangeEventHandler<HTMLInputElement> = (event) => {
        event.preventDefault();
        event.target.value = event.target.value.toUpperCase()
        setHasInput(true);
        if(event.target.value){
            setHasInput(true);
        }else{
            setHasInput(false);
        }
    }

    const handleFormResetClick:React.MouseEventHandler<HTMLButtonElement> = (event) => {
        setHasInput(false);
        console.log('form cleared')
    }

    const [hasInput, setHasInput] = useState(false);

    return (
        <>
            <ul className="flex space-x-2 border-t py-3">
                <li>
                    <Link to="/" className="text-gray-500 hover:underline">
                        Track a shipment
                    </Link>
                </li>
            </ul>
            <div className='pb-10'>
                <h1 className="pb-4 relative text-center font-extrabold text-4xl after:absolute after:bottom-0 after:left-[50%] after:translate-x-[-50%] after:h-1.5 after:w-24 after:rounded-md after:bg-blue-600">Tracking</h1>
            </div>

            <form onSubmit={formSubmit}>
                <div className="max-w-md mb-[10px] m-auto">
                    <div className="flex items-center relative">
                        <button className={`absolute px-2 ${hasInput ? 'right-9' : 'hidden'}`} type="reset" onClick={handleFormResetClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <button className={`absolute px-2 ${hasInput ? 'right-0 before:absolute before:bg-gray-400 before:left-0 before:w-[0.01rem] before:h-5 before:block' : 'left-0'}`} type="submit" disabled={hasInput ? false : true}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z" fill="#1C274C"/>
                            </svg>
                        </button>
                        <input id="trackingNumber" name='number' type="text" placeholder="Enter a Container/Bill of Lading Number" className={` ${hasInput ? 'pr-12' : 'pl-9'} form-input rounded-md bg-gray-200`} onChange={handletrackingNumberChange}/>
                    </div>
                </div>
            </form>

            {/* <div className="mb-5 max-w-md m-auto">
                <div className="flex focus-within:outline-blue-600 focus-within:outline-1 focus-within:outline-solid rounded-md">
                    <div className="bg-[#eee] flex justify-center items-center rounded-l-md px-3 font-semibold border border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z" fill="#1C274C"/>
                        </svg>
                    </div>
                    <input id="trackingNumber" type="text" placeholder="Enter a Container/Bill of Lading Number" className="form-input rounded-l-none focus:border-inherit" />
                </div>
            </div> */}

            {(isFetching || data)
            &&
            (<div className="pt-[50px] scroll-mt-20" ref={resultsRef}>

                {isFetching && <div className="pt-[45px]">
                    <div className="m-auto h-[180px] w-[180px]">
                        <div className="flex justify-center items-center relative h-[100%]
                                        before:content-[''] before:absolute before:top-1/2 before:left-1/2 
                                        before:-translate-x-1/2 before:-translate-y-1/2 before:-z-1 
                                        before:block before:h-[180px] before:w-[180px] before:rounded-full 
                                        before:bg-[linear-gradient(190deg,#f2f1ef,hsla(0,0%,100%,.5))]">

                            <svg className="w-[150px]" viewBox="0 0 470 470" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 470 470" version="1.1">
                            <clipPath id="clip-mask-wave-one">
                            <rect height="25" id="mask-1" width="358" x="56" y="300"/>
                            </clipPath>
                            <defs>
                            <symbol height="70" id="svg_34" preserveAspectRatio="xMidYMid meet" version="1" width="80" xmlns="http://www.w3.org/2000/svg">
                            <g id="svg_30" transform="translate(79.0198 0.551597) scale(1.00565 1) translate(-79.0198 -0.551597) translate(2.08419 0.551597) matrix(0.131444 0 0 0.103472 0.444676 0.434347)">
                                <path d="m281.8,2.58c-2.6,1.5 -10.3,5.8 -17,9.6c-6.8,3.8 -13.6,7.8 -15.2,8.9c-1.7,1.2 -4.4,2.8 -6,3.7c-11.2,6 -26.7,14.8 -32.6,18.6c-1.9,1.2 -6.9,4.1 -11,6.4c-4.1,2.3 -9.1,5.2 -11,6.3c-4.5,2.6 -12.9,7.5 -18.9,10.8c-4.4,2.5 -18.3,10.6 -26.6,15.6c-2.2,1.3 -5.8,3.3 -8,4.4c-2.2,1.1 -6.5,3.5 -9.5,5.4c-3,1.9 -7.3,4.4 -9.5,5.5c-2.2,1.2 -6.9,3.9 -10.5,6.1c-3.6,2.1 -7.8,4.6 -9.5,5.4c-1.6,0.8 -5.5,3.1 -8.5,4.9c-3,1.9 -11.3,6.7 -18.4,10.8c-7.1,4 -14.5,8.2 -16.5,9.4c-2,1.1 -6.2,3.6 -9.4,5.5c-8.2,4.8 -14.4,8.5 -20.1,11.6c-21.3,12.1 -21.5,12.2 -22.6,16.1c-1.4,5.1 -1.3,61.7 0.1,64.4c1.6,2.9 4.9,1.9 15.5,-4.5c4.9,-2.9 12.7,-7.5 17.4,-10.1c4.7,-2.6 12.6,-7.2 17.5,-10.2c5,-2.9 11.3,-6.5 14,-7.9c6.1,-3.1 11.1,-5.9 12.7,-7.3c0.7,-0.5 3.3,-2.1 5.8,-3.5c7.5,-4.1 26.2,-14.7 41.5,-23.7c5.5,-3.2 15.6,-9 22.5,-13c6.9,-3.9 17,-9.7 22.5,-12.9c8.8,-5.2 15.6,-9.1 33.4,-19.2c2.5,-1.4 6.9,-4 9.6,-5.7c2.8,-1.8 6.6,-4 8.5,-5c4.2,-2.1 16.7,-9.3 23.2,-13.4c3.5,-2.2 5.6,-2.8 8.5,-2.6l3.8,0.3l0.5,276c0.4,216 0.8,276.5 1.7,278.1c0.7,1.2 4.7,4.2 8.9,6.5c4.2,2.4 9.7,5.7 12.2,7.2c6.3,3.7 12.4,3.3 18.8,-1.2c2.4,-1.7 5.9,-3.8 7.7,-4.6c6.1,-2.9 11.1,-6.4 11.8,-8.2c0.4,-1 0.8,-125.4 0.8,-276.4c0.1,-218 0.4,-274.8 1.4,-276.1c2.5,-3.2 5,-2.9 13.2,1.9c17.3,10 27.2,15.7 31,17.8c6,3.3 30.2,17.3 36.5,21c3,1.8 10.2,6 16,9.3c5.8,3.3 17.7,10.1 26.5,15.3c8.8,5.1 21,12 27,15.4c6.1,3.4 15.1,8.6 20,11.5c5,2.9 13.1,7.7 18,10.5c5,2.9 13.1,7.6 18,10.5c5,3 10.8,6.3 13,7.6c6.8,3.7 22.8,13 26.5,15.2c1.9,1.2 4.7,2.2 6.2,2.2c5.3,0 5.5,-1.6 5.4,-34.5c-0.1,-26.7 -0.3,-30.4 -1.8,-32.7c-1.5,-2.3 -10.5,-8 -21.2,-13.6c-1.5,-0.8 -5.6,-3.2 -9,-5.3c-3.3,-2.1 -9.5,-5.7 -13.6,-7.9c-4.1,-2.3 -10.4,-5.8 -14,-8c-3.6,-2.2 -8.3,-4.9 -10.5,-6c-2.2,-1.1 -6.5,-3.6 -9.5,-5.5c-3,-1.8 -7.1,-4.3 -9,-5.3c-1.9,-1.1 -7.5,-4.3 -12.5,-7.1c-4.9,-2.9 -10.3,-6 -12,-6.9c-1.6,-0.9 -6.8,-3.9 -11.5,-6.7c-4.7,-2.7 -9.7,-5.7 -11.2,-6.5c-1.4,-0.8 -4.8,-2.8 -7.5,-4.3c-2.6,-1.5 -7,-4 -9.8,-5.6c-2.7,-1.5 -9,-5.2 -14,-8.1c-4.9,-2.9 -15.5,-9 -23.5,-13.5c-22.3,-12.6 -29.3,-16.6 -32,-18.5c-1.4,-0.9 -5.6,-3.4 -9.5,-5.5c-3.8,-2.2 -9.2,-5.3 -12,-7.1c-2.7,-1.7 -8.6,-5 -13,-7.4c-4.4,-2.3 -8.7,-4.8 -9.5,-5.5c-0.8,-0.7 -3.1,-2.1 -5.1,-3.1c-2,-1.1 -6.4,-3.4 -9.7,-5.2c-7.4,-3.9 -9.3,-3.9 -15.4,-0.4z" id="svg_33"/>
                                <path d="m213.5,149.48c-9.1,5.5 -17.5,10.3 -30.7,17.7c-2.4,1.3 -9.9,5.6 -16.8,9.6c-6.9,4 -16.8,9.8 -22,12.8c-5.2,3 -13.1,7.6 -17.5,10.2c-12.9,7.6 -21.2,12.4 -25.3,14.5c-2,1.1 -6.6,3.8 -10.1,5.9c-3.5,2.2 -8.1,4.9 -10.1,6c-11.6,6.5 -24.1,13.6 -36,20.6c-7.4,4.3 -19.8,11.4 -27.4,15.7c-9.6,5.4 -14.5,8.7 -15.8,10.8c-1.7,2.9 -1.8,8.1 -1.8,113.4l0,110.4l3.3,3.1c1.8,1.7 8.3,5.8 14.3,9c6,3.3 12,6.7 13.4,7.6c6.6,4.4 19.2,11 20.9,11c1.1,0 2.6,-0.3 3.5,-0.6c1.5,-0.6 1.6,-11.1 1.6,-206.3l0,-7.4l4.2,-3.9c2.3,-2.1 4.7,-3.8 5.3,-3.8c0.7,0 3,-1.2 5.1,-2.6c5,-3.4 9.1,-4.6 11.5,-3.3c1.8,0.9 1.9,4.8 1.9,123.9l0,122.8l3.8,3c2,1.6 5.3,3.7 7.2,4.7c1.9,1 4.6,2.6 6,3.5c4.3,2.9 21.5,13 22.2,13c0.4,0 2.9,1.4 5.5,3c3.9,2.5 10.3,4 11.5,2.7c0.2,-0.1 0.5,-70.5 0.8,-156.3c0.5,-152 0.6,-156.2 2.4,-158.3c1.1,-1.2 5.6,-4.1 10.2,-6.6c7.9,-4.3 13.6,-5.7 14.9,-3.5c0.3,0.6 0.6,77.7 0.6,171.4l0,170.4l2.7,3.5c1.5,2 5,4.8 7.7,6.2c2.8,1.4 9.1,5 14,8c13.1,7.8 24.7,14.2 27.3,15c5.6,1.7 5.2,18.5 5.2,-239.9c0,-183.9 -0.3,-238.5 -1.2,-239.4c-2.1,-2.1 -6.1,-1.3 -12.3,2.5z" id="svg_32"/>
                                <path d="m352.1,147.18c-0.8,1 -1.1,63.9 -1.1,238.9c0,216 0.2,237.7 1.6,239.2c2.2,2.2 6.6,0.7 18.4,-6.4c3.6,-2.2 12.4,-7.3 19.5,-11.4c7.2,-4 17.1,-9.7 22,-12.7c5,-2.9 10.8,-6.3 13,-7.5c2.2,-1.2 7.4,-4.2 11.5,-6.6c12.1,-7.1 13.1,-7.7 21.8,-12.7c12.6,-7.2 14.9,-8.5 25.7,-14.7c5.5,-3.2 14.3,-8.2 19.5,-11.2c5.2,-3 11.8,-6.8 14.5,-8.5c2.8,-1.7 7.3,-4.3 10,-5.8c2.8,-1.4 9.1,-5 14,-8c5,-2.9 10.8,-6.2 13,-7.4c6.6,-3.7 8.7,-4.9 15.1,-8.9c5.4,-3.3 6.3,-4.3 7.2,-8c0.5,-2.4 0.9,-17.1 0.8,-34c-0.2,-26.7 -0.4,-29.9 -1.9,-31.5c-1.6,-1.5 -4.7,-1.7 -26.6,-2c-27.2,-0.4 -32.5,0.3 -33.5,4.1c-0.3,1.2 -0.6,8.4 -0.6,16l0,13.8l-3.1,2.8c-1.7,1.6 -4.3,3.5 -5.7,4.2c-2.7,1.3 -4.2,2.2 -25.7,14.6c-6.6,3.9 -13.3,7.7 -15,8.5c-1.6,0.8 -7.5,4.1 -13,7.3c-5.5,3.2 -10.9,6.3 -12,6.9c-1.1,0.6 -3.6,2 -5.5,3.2c-13.8,8.4 -17.8,10 -20.5,8c-1.3,-1 -1.5,-16.5 -1.5,-131.5c-0.1,-100.5 0.2,-130.6 1.1,-131.8c0.8,-0.9 2.1,-1.2 3.6,-0.8c2.5,0.6 27.8,14.7 53.8,30c8.2,4.8 21.4,12.3 29,16.4c9,5 12.8,7.6 13.6,9.8c0.5,1.3 0.9,8.7 0.9,16.3c0,13.6 0.1,14 2.4,15.5c2.1,1.4 6.4,1.6 29.1,1.5c15.9,0 27.5,-0.5 28.6,-1.1c1.8,-0.9 1.9,-2.6 2.1,-26.2c0.3,-31 0,-39.5 -1.6,-42.5c-1.3,-2.6 -4.4,-4.5 -18.1,-11.7c-4.9,-2.6 -9.7,-5.3 -10.6,-6.1c-0.9,-0.8 -3.5,-2.5 -5.8,-3.7c-6.7,-3.6 -28.9,-16.4 -39.6,-22.7c-5.5,-3.3 -11.8,-6.9 -14,-8c-2.2,-1.1 -6.5,-3.6 -9.5,-5.5c-3,-1.9 -7.1,-4.2 -9,-5.3c-1.9,-1 -8,-4.5 -13.5,-7.7c-9.7,-5.7 -14.2,-8.2 -23.5,-13.2c-2.5,-1.4 -5.2,-3.1 -6,-3.8c-0.8,-0.7 -3.1,-2 -5,-2.9c-1.9,-0.8 -6.4,-3.4 -10,-5.7c-3.6,-2.3 -9.6,-5.9 -13.5,-8c-3.8,-2.1 -9.2,-5.1 -11.9,-6.6c-2.6,-1.6 -6.9,-4 -9.5,-5.4c-2.5,-1.4 -7.8,-4.4 -11.8,-6.7c-7.5,-4.4 -11.3,-5.2 -13.2,-2.8z" id="svg_31"/>
                            </g>
                            </symbol>
                            </defs>
                            <clipPath id="clip-mask-wave-two">
                            <rect height="25" id="mask-2" width="328" x="73" y="329"/>
                            </clipPath>
                            <g className="layer animate-[boat_1s_ease_infinite]" display="inline">
                            <title>Layer 1</title>
                            <path d="m99.72,228.88c-2.21,0 -4,-1.79 -4,-4l0,-48.15c0,-2.21 1.79,-4 4,-4l36.44,0c2.21,0 4,1.79 4,4c0,2.21 -1.79,4 -4,4l-32.44,0l0,44.15c0,2.21 -1.79,4 -4,4" id="svg_2"/>
                            <path d="m378.01,228.02c-2.21,0 -4,-1.79 -4,-4l0,-43.28l-167.41,0c-2.21,0 -4,-1.79 -4,-4c0,-2.21 1.79,-4 4,-4l171.41,0c2.21,0 4,1.79 4,4l0,47.28c0,2.21 -1.79,4 -4,4" id="svg_3"/>
                            <path d="m380.44,300.9c-0.8,0 -1.61,-0.24 -2.31,-0.74c-1.8,-1.28 -2.23,-3.78 -0.95,-5.58c11.7,-16.5 26.31,-45.33 27.38,-53.5c-12.77,-0.68 -81.23,-1.33 -160.01,-1.49c-84.43,-0.17 -146.4,0.3 -160.39,1.19c0,0.03 0,0.06 0,0.09c-0.33,9.09 -1.34,36.76 0.93,45.09c0.58,2.13 -0.68,4.33 -2.81,4.91c-2.14,0.58 -4.33,-0.68 -4.91,-2.81c-2.3,-8.43 -1.85,-29.8 -1.2,-47.49c0.06,-1.7 0.11,-2.86 0.11,-3.28c0,-1.22 0.58,-2.42 1.53,-3.17c1.54,-1.23 2.31,-1.84 53.98,-2.29c28.17,-0.24 67.41,-0.33 110.5,-0.25c44.27,0.08 160.35,0.57 165.82,1.81c1.84,0.42 3.29,1.71 3.99,3.53c0.73,1.9 2.42,6.33 -8.85,28.95c-5.89,11.82 -13.56,24.9 -19.53,33.32c-0.8,1.13 -2.03,1.71 -3.28,1.71" id="svg_4" transform="matrix(1 0 0 1 0 0)"/>
                            <path d="m306.31,226.34c-2.21,0 -4,-1.79 -4,-4l0,-43.69c0,-2.21 1.79,-4 4,-4c2.21,0 4,1.79 4,4l0,43.69c0,2.2 -1.79,4 -4,4" id="svg_5"/>
                            <path d="m341.05,226.34c-2.21,0 -4,-1.79 -4,-4l0,-43.69c0,-2.21 1.79,-4 4,-4c2.21,0 4,1.79 4,4l0,43.69c0,2.2 -1.79,4 -4,4" id="svg_6"/>
                            <path d="m237.48,226.34c-2.21,0 -4,-1.79 -4,-4l0,-43.69c0,-2.21 1.79,-4 4,-4c2.21,0 4,1.79 4,4l0,43.69c0,2.2 -1.79,4 -4,4" id="svg_7"/>
                            <path d="m271.9,226.34c-2.21,0 -4,-1.79 -4,-4l0,-43.69c0,-2.21 1.79,-4 4,-4c2.21,0 4,1.79 4,4l0,43.69c0,2.2 -1.79,4 -4,4" id="svg_8"/>
                            <path d="m151.96,226.34c-2.21,0 -4,-1.79 -4,-4l0,-73.8c0,-2.21 1.79,-4 4,-4l38.44,0c2.21,0 4,1.79 4,4l0,73.17c0,2.21 -1.79,4 -4,4s-4,-1.79 -4,-4l0,-69.17l-30.44,0l0,69.8c0,2.2 -1.79,4 -4,4" id="svg_9"/>
                            <path d="m157.88,137.94c-2.21,0 -4,-1.79 -4,-4l0,-16.25c0,-2.21 1.79,-4 4,-4c2.21,0 4,1.79 4,4l0,16.25c0,2.21 -1.79,4 -4,4" id="svg_10"/>
                            <path d="m378.01,208.22l-171.41,0c-2.21,0 -4,-1.79 -4,-4c0,-2.21 1.79,-4 4,-4l171.41,0c2.21,0 4,1.79 4,4c0,2.21 -1.79,4 -4,4" id="svg_11"/>
                            <path d="m136.16,208.22l-36.44,0c-2.21,0 -4,-1.79 -4,-4c0,-2.21 1.79,-4 4,-4l36.44,0c2.21,0 4,1.79 4,4c0,2.21 -1.79,4 -4,4" id="svg_12"/>
                            <path d="m99.72,257.29l-18.22,0c-2.21,0 -4,-1.79 -4,-4c0,-2.21 1.79,-4 4,-4l18.22,0c2.21,0 4,1.79 4,4c0,2.21 -1.79,4 -4,4" id="svg_13"/>
                            <g clipPath="url(#clip-mask-wave-one)" id="svg_17">
                            <g className="wave-one animate-[wave-one_1s_ease_infinite]" id="svg_18">
                                <path d="m384.63,325.45c-11.22,0 -21.9,-4.35 -29.89,-12.07c-8,7.72 -18.67,12.07 -29.89,12.07c-11.27,0 -21.98,-4.39 -29.99,-12.17c-7.99,7.78 -18.64,12.17 -29.8,12.17c-11.22,0 -21.9,-4.35 -29.89,-12.07c-8.01,7.72 -18.72,12.07 -30,12.07c-11.27,0 -21.98,-4.39 -29.99,-12.17c-8,7.78 -18.69,12.17 -29.91,12.17c-11.21,0 -21.86,-4.34 -29.86,-12.04c-8.01,7.7 -18.73,12.04 -30.04,12.04c-12.7,0 -24.7,-5.58 -32.91,-15.3c-1.43,-1.69 -1.21,-4.21 0.48,-5.64c1.69,-1.43 4.21,-1.21 5.64,0.47c6.69,7.92 16.46,12.46 26.8,12.46c10.46,0 20.3,-4.54 26.99,-12.46c0.76,-0.9 1.88,-1.42 3.06,-1.42c1.18,0 2.3,0.52 3.06,1.42c6.69,7.92 16.46,12.46 26.8,12.46c10.29,0 20.03,-4.54 26.72,-12.46c0.76,-0.9 1.88,-1.42 3.06,-1.42l0.27,0c1.18,0 2.3,0.52 3.06,1.42c6.69,7.92 16.46,12.46 26.8,12.46c10.41,0 20.22,-4.54 26.91,-12.46c0.76,-0.9 1.88,-1.42 3.06,-1.42c1.18,0 2.37,0.52 3.13,1.42c6.69,7.92 16.46,12.46 26.8,12.46c10.37,0 19.82,-4.43 26.6,-12.46c0.76,-0.9 1.88,-1.42 3.06,-1.42l0.27,0c1.18,0 2.3,0.52 3.06,1.42c6.69,7.92 16.45,12.46 26.8,12.46c10.34,0 20.11,-4.54 26.8,-12.46c0.76,-0.9 1.88,-1.42 3.05,-1.42c1.18,0 2.37,0.52 3.13,1.42c6.69,7.92 16.46,12.46 26.8,12.46c10.34,0 20.11,-4.54 26.8,-12.46c1.43,-1.68 3.95,-1.9 5.64,-0.47c1.69,1.42 1.9,3.95 0.47,5.64c-8.25,9.73 -20.25,15.3 -32.95,15.3" id="svg_19"/>
                            </g>
                            </g>
                            <g clipPath="url(#clip-mask-wave-two)" id="svg_20">
                            <g className="wave-two animate-[wave-two_1s_ease_infinite]" id="svg_21">
                                <path d="m384.63,356.31c-11.23,0 -21.9,-4.35 -29.89,-12.07c-8,7.72 -18.67,12.07 -29.89,12.07c-11.27,0 -21.98,-4.39 -29.99,-12.17c-7.99,7.78 -18.64,12.17 -29.8,12.17c-11.23,0 -21.9,-4.35 -29.89,-12.07c-8.01,7.72 -18.72,12.07 -30,12.07c-11.27,0 -21.98,-4.39 -29.99,-12.17c-8,7.78 -18.69,12.17 -29.91,12.17c-11.21,0 -21.86,-4.34 -29.86,-12.04c-8.01,7.7 -18.73,12.04 -30.04,12.04c-12.7,0 -24.7,-5.58 -32.91,-15.3c-1.43,-1.69 -1.21,-4.21 0.48,-5.64c1.69,-1.42 4.21,-1.21 5.64,0.48c6.69,7.92 16.46,12.46 26.8,12.46c10.46,0 20.3,-4.54 26.99,-12.46c0.76,-0.9 1.88,-1.42 3.06,-1.42c1.18,0 2.3,0.52 3.06,1.42c6.69,7.92 16.45,12.46 26.8,12.46c10.29,0 20.03,-4.54 26.72,-12.46c0.76,-0.9 1.88,-1.42 3.06,-1.42l0.27,0c1.18,0 2.3,0.52 3.06,1.42c6.69,7.92 16.46,12.46 26.8,12.46c10.41,0 20.22,-4.54 26.91,-12.46c0.76,-0.9 1.88,-1.42 3.06,-1.42c1.18,0 2.37,0.52 3.13,1.42c6.69,7.92 16.46,12.46 26.8,12.46c10.37,0 19.82,-4.43 26.6,-12.46c0.76,-0.9 1.88,-1.42 3.06,-1.42l0.27,0c1.18,0 2.3,0.52 3.06,1.42c6.69,7.92 16.45,12.46 26.8,12.46c10.34,0 20.11,-4.54 26.8,-12.46c0.76,-0.9 1.88,-1.42 3.05,-1.42c1.18,0 2.37,0.52 3.13,1.42c6.69,7.92 16.45,12.46 26.8,12.46c10.34,0 20.11,-4.54 26.8,-12.46c1.43,-1.68 3.95,-1.9 5.64,-0.48c1.69,1.42 1.9,3.95 0.47,5.64c-8.25,9.73 -20.24,15.3 -32.95,15.3" id="svg_22" transform="translate(25 32) scale(0.9)"/>
                            </g>
                            </g>
                            <use href="#svg_34" id="svg_35" transform="matrix(0.783115 0 0 0.783115 205.908 243.237)"/>
                            </g>
                            </svg>
                        </div>
                    </div>
                </div>}

                {data?.total_records > 0 && <><div className='pb-6 border-b-2'>
                    <span className='text-3xl font-extrabold'>
                        Container Number: {data?.containers[0].number}
                    </span>
                </div>
                <div className='pt-6'>
                    <ul className='flex gap-10 flex-wrap'>
                        <li>
                            <div>
                                <span className='block text-[1rem]'>Container Number</span>
                                <span className='block text-[1.1rem] font-extrabold'>{data?.containers[0].number}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span className='block text-[1rem]'>Shipped From</span>
                                <span className='block text-[1.1rem] font-extrabold'>{collect<any>(data?.containers[0].trackings).where('status', 'start').last()?.location}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span className='block text-[1rem]'>Port of Load</span>
                                <span className='block text-[1.1rem] font-extrabold'>{collect<any>(data?.containers[0].trackings).where('status', 'start').last()?.location}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span className='block text-[1rem]'>Port of Discharge</span>
                                <span className='block text-[1.1rem] font-extrabold'>{collect<any>(data?.containers[0].trackings).where('status', 'over').first()?.location??'--'}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <span className='block text-[1rem]'>Shipped To</span>
                                <span className='block text-[1.1rem] font-extrabold'>{collect<any>(data?.containers[0].trackings).where('status', 'over').first()?.location??'--'}</span>
                            </div>
                        </li>   
                    </ul>
                </div>
                <div className='mt-16'>
                    <span className='text-[22px] font-extrabold mb-9 block'>
                        CONTAINERS
                    </span>
                    <Accordion
                        elevation={0}
                        sx={{ 
                            backgroundColor: 'transparent',
                        }}
                        defaultExpanded
                    >
                        <AccordionSummary
                            // expandIcon={
                            //     <div className="icon-wrapper">
                            //         <AddIcon className="plus" />
                            //         <RemoveIcon className="minus" />
                            //     </div>
                            // }
                            sx={{
                                border: '2px solid transparent',
                                borderRadius: '8px',
                                padding: 0,
                                boxShadow: '0 3px 66px -10px rgba(34,34,33,.5)',
                                '& .MuiAccordionSummary-content': {
                                    margin: 0,
                                    flexWrap: 'wrap',
                                    padding: '17px 20px 17px 30px',
                                },
                                minHeight: '7.5rem',
                                '&.Mui-expanded': {
                                    minHeight: '7.5rem',
                                    border: '2px solid #4361ee'
                                },
                                '& .MuiAccordionSummary-content.Mui-expanded': {
                                    margin: 0,
                                },
                                // flexDirection: 'row',
                                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                                    transform: 'none', // Disable the default rotation
                                },
                                '& .minus': { display: 'none' },
                                '& .Mui-expanded .minus': { display: 'block' },
                                '& .Mui-expanded .plus': { display: 'none' },
                                '&:before':{
                                    content: "''",
                                    position: 'absolute',
                                    display: 'block',
                                    left: '0',
                                    right: '0',
                                    bottom: '0',
                                    height: '78px',
                                    backgroundColor: '#f2f2f2',
                                    zIndex: '-1',
                                },
                                '@media (min-width: 800px)': {
                                    '& .MuiAccordionSummary-content': {
                                        padding: '0',
                                    },
                                    '&:before':{
                                        top: '0',
                                        left: 'auto',
                                        width: '40%',
                                        height: 'auto',
                                    },
                                },
                            }}
                        >
                            <div className='w-full min-[800px]:w-[30%]'>
                                <div className='flex flex-wrap justify-start min-[800px]:justify-center items-center min-[800px]:min-h-[120px]'>
                                    <div className="flex flex-wrap items-end">
                                        <span className="mtc-icon-container-empty text-[16px] font-extrabold! mr-2.5 mb-1"></span>
                                        <div>
                                            <span className='block'>Container</span>
                                            <span className='block text-[16px]'>{data?.containers[0].number}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full min-[800px]:w-[30%]'>
                                <div className='flex flex-wrap justify-start min-[800px]:justify-center items-center min-[800px]:min-h-[120px] mb-9 min-[800px]:mb-0'>
                                    <div className="flex flex-wrap items-end">
                                        <span className="mtc-icon-type text-[25px] mr-2.5 mb-1"></span>
                                        <div>
                                            <span className='block'>Type</span>
                                            <span className='block text-[16px]'>{data?.containers[0].category.size_in_feet}' {data?.containers[0].category.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-[75%] min-[800px]:w-[30%]'>
                                <div className='flex flex-wrap justify-start min-[800px]:justify-center items-center min-[800px]:min-h-[120px]'>
                                    <div className="flex flex-wrap items-end">
                                        <span className="mtc-icon-marker text-[30px] mr-2.5 mb-1"></span>
                                        <div>
                                            <span className='block'>Latest move</span>
                                            <span className='block text-[16px]'>{collect<any>(data?.containers[0].trackings).first().location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-[25%] min-[800px]:w-[10%]'>
                                <div className='flex flex-wrap justify-end min-[800px]:justify-center items-center min-h-12 min-[800px]:min-h-[120px]'>
                                    <div className="icon-wrapper bg-[#eed484] p-1 rounded-full">
                                        <AddIcon className="plus" />
                                        <RemoveIcon className="minus" />
                                    </div>
                                </div>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails
                        sx={{
                            'marginTop': '25px',
                            'padding': 0,
                        }}
                        >
                            <div className="max-[800px]:hidden flex items-center bg-[#f2f2f2] rounded-xl py-[12px]">
                                <div className="w-[10%]">
                                </div>
                                <div className="w-[20%] px-[5px]">
                                    <span className="text-[13px] font-bold block">Date</span>
                                </div>
                                <div className="w-[35%] px-[5px]">
                                    <span className="text-[13px] font-bold block">Location</span>
                                </div>
                                <div className="w-[35%] px-[5px]">
                                    <span className="text-[13px] font-bold block">Description</span>
                                </div>
                            </div>
                            <div>

                                {/* <div>
                                    <div className='py-[42px] relative border-b border-[#eee]

                                        before:bg-[#eed484]
                                        before:bottom-0
                                        before:block
                                        before:left-[8%]
                                        before:absolute
                                        before:translate-x-[-50%]
                                        before:w-[3px]
                                        before:top-[24px]

                                        min-[800px]:flex
                                        min-[800px]:items-center
                                        min-[800px]:py-[20px]
                                        min-[800px]:px-0
                                        min-[800px]:before:left-[5%]
                                        min-[800px]:before:top-[50%]'>

                                        <div className='min-[800px]:block w-[10%] hidden'>
                                            <div className='p-[5px] flex justify-center items-center'>
                                                <div className='flex flex-wrap items-center mx-auto my-0 relative'>
                                                    <span className='bg-[#fff] border-5 border-[#eed484] h-[16px] w-[16px] rounded-full'></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='min-[800px]:w-[20%]'>
                                            <div className='pr-[10px] pl-[70px] min-[800px]:p-[5px] min-[800px]:m-0 flex justify-start items-center mb-[25px]'>
                                                <div className='flex flex-wrap items-center'>
                                                    <span className='bg-[#fff] border-5 border-[#eed484] rounded-full h-[16px] w-[16px] absolute left-[8.2%] translate-x-[-50%] top-[42px] min-[800px]:hidden'></span>
                                                    <span>
                                                        12/12/2025
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='min-[800px]:w-[35%]'>
                                            <div className='pr-[10px] pl-[70px] min-[800px]:p-[5px] min-[800px]:m-0 flex justify-start items-center mb-[25px]'>
                                                <div className='flex flex-wrap items-center'>
                                                    <span>
                                                        Yantian,  CN
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='min-[800px]:w-[35%]'>
                                            <div className='pr-[10px] pl-[70px] min-[800px]:p-[5px] min-[800px]:m-0 flex justify-start items-center'>
                                                <div className='flex flex-wrap items-center'>
                                                    <span>
                                                        Empty to Shipper
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className='py-[42px] relative border-b border-[#eee]

                                        before:bg-[#eed484]
                                        before:bottom-0
                                        before:block
                                        before:left-[8%]
                                        before:absolute
                                        before:translate-x-[-50%]
                                        before:w-[3px]
                                        before:top-0

                                        min-[800px]:flex
                                        min-[800px]:items-center
                                        min-[800px]:py-[20px]
                                        min-[800px]:px-0
                                        min-[800px]:before:left-[5%]
                                        min-[800px]:before:top-0'>

                                        <div className='min-[800px]:block w-[10%] hidden'>
                                            <div className='p-[5px] flex justify-center items-center'>
                                                <div className='flex flex-wrap items-center mx-auto my-0 relative'>
                                                    <span className='bg-[#fff] border-5 border-[#eed484] h-[16px] w-[16px] rounded-full'></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='min-[800px]:w-[20%]'>
                                            <div className='pr-[10px] pl-[70px] min-[800px]:p-[5px] min-[800px]:m-0 flex justify-start items-center mb-[25px]'>
                                                <div className='flex flex-wrap items-center'>
                                                    <span className='bg-[#fff] border-5 border-[#eed484] rounded-full h-[16px] w-[16px] absolute left-[8.2%] translate-x-[-50%] top-[42px] min-[800px]:hidden'></span>
                                                    <span>
                                                        12/12/2025
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='min-[800px]:w-[35%]'>
                                            <div className='pr-[10px] pl-[70px] min-[800px]:p-[5px] min-[800px]:m-0 flex justify-start items-center mb-[25px]'>
                                                <div className='flex flex-wrap items-center'>
                                                    <span>
                                                        Yantian,  CN
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='min-[800px]:w-[35%]'>
                                            <div className='pr-[10px] pl-[70px] min-[800px]:p-[5px] min-[800px]:m-0 flex justify-start items-center'>
                                                <div className='flex flex-wrap items-center'>
                                                    <span>
                                                        Empty to Shipper
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {data?.containers[0]?.trackings?.map((item, index) => {
                                    
                                    return (
                                        <div key={index}>
                                            <div className={`py-[42px] relative

                                                ${item['status'] == 'start' ? '' : 'border-b border-[#eee]'}
                                                
                                                before:bg-[#eed484]
                                                ${item['status'] == 'start' ? 'before:bottom-[42px]' : 'before:bottom-0'}
                                                before:block
                                                before:left-[8%]
                                                before:absolute
                                                before:translate-x-[-50%]
                                                before:w-[3px]
                                                ${item['status'] == 'over' ? 'before:top-[24px]' : 'before:top-0'}

                                                min-[800px]:flex
                                                min-[800px]:items-center
                                                min-[800px]:py-[20px]
                                                min-[800px]:px-0
                                                min-[800px]:before:left-[5%]
                                                ${item['status'] == 'start' ? 'min-[800px]:before:bottom-[50%]' : ''}
                                                ${item['status'] == 'over' ? 'min-[800px]:before:top-[50%]' : 'min-[800px]:before:top-0'}`}>

                                                <div className='min-[800px]:block w-[10%] hidden'>
                                                    <div className='p-[5px] flex justify-center items-center'>
                                                        <div className='flex flex-wrap items-center mx-auto my-0 relative'>
                                                            <span className={`rounded-full border-[#eed484]
                                                                ${item['status'] !== 'start' ? 'border-5 h-[16px] w-[16px] bg-[#fff]' : 'border-[2px] h-[38px] w-[38px] bg-[#eed484]'}
                                                                ${item['status'] == 'start' ? 'before:content-[""] before:font-[icomoon] before:text-[#fff] before:text-[22px] before:left-[50%] before:absolute before:top-[50%] before:translate-[-50%]' : ''}`}>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='min-[800px]:w-[20%]'>
                                                    <div className='pr-[10px] pl-[70px] min-[800px]:p-[5px] min-[800px]:m-0 flex justify-start items-center mb-[25px]'>
                                                        <div className='flex flex-wrap items-center'>
                                                            <span className={`border-[#eed484] rounded-full absolute left-[8.2%] translate-x-[-50%] min-[800px]:hidden
                                                                ${item['status'] !== 'start' ? 'bg-[#fff] border-5 h-[16px] w-[16px] top-[42px]' : 'bg-[#eed484] border-[2px] h-[38px] w-[38px] top-auto bottom-[35px]'}
                                                                ${item['status'] == 'start' ? 'before:content-[""] before:font-[icomoon] before:text-[#fff] before:text-[22px] before:left-[50%] before:absolute before:top-[50%] before:translate-[-50%]' : ''}`}>
                                                            </span>
                                                            <span>
                                                                {dayjs(item['date']).format('DD/MM/YYYY')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='min-[800px]:w-[35%]'>
                                                    <div className='pr-[10px] pl-[70px] min-[800px]:p-[5px] min-[800px]:m-0 flex justify-start items-center mb-[25px]'>
                                                        <div className='flex flex-wrap items-center'>
                                                            <span>
                                                                {item['location']}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='min-[800px]:w-[35%]'>
                                                    <div className='pr-[10px] pl-[70px] min-[800px]:p-[5px] min-[800px]:m-0 flex justify-start items-center'>
                                                        <div className='flex flex-wrap items-center'>
                                                            <span>
                                                                {item['description']}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div></>}

                {!isFetching && data?.total_records == 0 && <div className="flex justify-center items-center pr-[20px] border-y border-solid border-blue-600">
                    <span className="text-[156px] mr-[20px] mtc-icon-dry-container-logo-empty"></span>
                    <p>No results found for this Bill of Lading number. Please recheck that the number is complete and correct and in the B/L format.</p>
                </div>}
            </div>)}

            <div className="mt-28 mb-6 text-center">
                <div className="max-w-[1920px] mx-auto">
                    <div className="flex flex-wrap">
                        <div className="pb-[20px] w-[100%] grow-0 shrink-0 basis-auto min-[768px]:w-[68%] min-[768px]:ml-[16%]">
                            <h2 className="mb-[20px] pb-[25px] relative text-center font-extrabold text-[29px] after:absolute after:bottom-0 after:left-[50%] after:translate-x-[-50%] after:h-1.5 after:w-24 after:rounded-md after:bg-blue-600">Solutions to Simplify your <br></br> Shipping Experience</h2>
                            {/* <div> */}
                                <p className="text-left m-0">With an eBusiness area build entirely around your needs and dedicated Digital Business Solutions, we are always by your side, to make shipping easier than ever!</p>
                            {/* </div> */}
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="w-[100%] grow-0 shrink-0 basis-auto">
                            <div className="grid gap-[15px] grid-cols-[repeat(1,1fr)] min-[768px]:grid-cols-[repeat(4,1fr)]">
                                <div className="max-[767px]:w-[100%] min-[768px]:col-start-2 min-[768px]:col-span-1  h-[450px] relative before:absolute before:inset-0 before:z-1 before:bg-black/20 before:bg-linear-to-t before:from-black/70 before:from-15% before:to-transparent before:to-70% before:transition-colors before:duration-1200 before:ease-out">
                                    <img className="h-[100%] left-0 object-cover absolute top-0 w-[100%]" src="/assets/images/MSC24031234.webp" alt="" />
                                    <div className="flex max-[767px]:justify-center items-center flex-col flex-nowrap h-[100%] justify-end px-[30px] py-[10%] relative top-0 w-[100%] z-2">
                                        <div className="text-[22px] text-white font-extrabold m-0 mb-[10px] overflow-hidden p-0">
                                            Your eBusiness Area
                                        </div>
                                    </div>
                                </div>

                                <div className="max-[767px]:w-[100%] min-[768px]:col-start-3 min-[768px]:col-span-1  h-[450px] relative before:absolute before:inset-0 before:z-1 before:bg-black/20 before:bg-linear-to-t before:from-black/70 before:from-15% before:to-transparent before:to-70% before:transition-colors before:duration-1200 before:ease-out">
                                    <img className="h-[100%] left-0 object-cover absolute top-0 w-[100%]" src="/assets/images/Direct Integrations.webp" alt="" />
                                    <div className="flex max-[767px]:justify-center items-center flex-col flex-nowrap h-[100%] justify-end px-[30px] py-[10%] relative top-0 w-[100%] z-2">
                                        <div className="text-[22px] text-white font-extrabold m-0 mb-[10px] overflow-hidden p-0">
                                            Direct Integrations Solutions
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Index;
