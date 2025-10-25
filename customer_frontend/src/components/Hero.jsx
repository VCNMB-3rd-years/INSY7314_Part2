import React from 'react';
import {TypeAnimation } from 'react-type-animation';

const Hero = () => {
  return (
    <div className='text-white py-16'>
        <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <div className='flex justify-center items-center'>
          <p className='md:text-5xl sm:text-4xl text-xl font-bold py-4'>
            Fast, flexible financing for
          </p>
           <TypeAnimation
            sequence={[
              'Family', // Types 'BTB'
              4000,  // Waits 1s
              'Business', // Deletes 'BTB' and types 'BTC'
              4000,  // Waits 1s
              'Personal',// Deletes 'BTC' and types 'SASS'
              4000,  // Waits 1s
            ]}
            wrapper="span"
            speed={50}
            className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2 text-[#8DAB7F]'
            repeat={Infinity}
          />
        </div>
        <p className='md:text-2xl text-xl font-bold text-[#587B7F]'> 
             Make quick and efficient payments via our <b>SWITF</b> payment gate!
        </p>
         </div>
    </div>
  );
};

export default Hero;



/*
REFERENCES
===================
Code Commerce, 2022. React JS & Tailwind CSS Responsive Website - Beginner Friendly. [video online]. Avaliable at: https://www.youtube.com/watch?v=ZU-drSVodBw [Accessed 8 October 2025]

*/