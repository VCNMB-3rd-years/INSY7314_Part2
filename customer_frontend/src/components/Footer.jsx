import React from 'react';
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from 'react-icons/fa'


const Footer = () => {
  return (
    <div className='max-w-[1240px] mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 bg-[#1E2019] text-[#587B7F]'>
        <div>
        <h1 className='w-full text-3xl font-bold text-[#8DAB7F]'>REACT.</h1>
        <p className='py-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id odit ullam iste repellat consequatur libero reiciendis, blanditiis accusantium.</p>
        <div className='flex justify-between md:w-[75%] my-6'>
            <FaFacebookSquare size={30} className="hover:text-[#8DAB7F] cursor-pointer transition-colors duration-200" /> 
            <FaInstagram size={30} className="hover:text-[#8DAB7F] cursor-pointer transition-colors duration-200" />
            <FaTwitterSquare size={30} className="hover:text-[#8DAB7F] cursor-pointer transition-colors duration-200" />
            <FaGithubSquare size={30} className="hover:text-[#8DAB7F] cursor-pointer transition-colors duration-200" />
            <FaDribbbleSquare size={30} className="hover:text-[#8DAB7F] cursor-pointer transition-colors duration-200" />
        </div>
        </div>
      <div className='lg:col-span-2 flex justify-between mt-6'>
        <div>
            <h6 className='font-medium text-[#8DAB7F]'>Solutions</h6> 
             <ul>
                <li className='py-2 text-sm'>Analytics</li>
                <li className='py-2 text-sm'>Marketing</li>
                <li className='py-2 text-sm'>Commerce</li>
                <li className='py-2 text-sm'>Insights</li>
            </ul>
        </div>
        <div>
            <h6 className='font-medium text-[#8DAB7F]'>Support</h6>
            <ul>
                <li className='py-2 text-sm'>Pricing</li>
                <li className='py-2 text-sm'>Documentation</li>
                <li className='py-2 text-sm'>Guides</li>
                <li className='py-2 text-sm'>API Status</li>
            </ul>
        </div>
        <div>
            <h6 className='font-medium text-[#8DAB7F]'>Company</h6>
            <ul>
                <li className='py-2 text-sm'>About</li>
                <li className='py-2 text-sm'>Blog</li>
                <li className='py-2 text-sm'>Jobs</li>
                <li className='py-2 text-sm'>Press</li>
                <li className='py-2 text-sm'>Careers</li>
            </ul>
        </div>
        <div>
            <h6 className='font-medium text-[#8DAB7F]'>Legal</h6>
            <ul>
                <li className='py-2 text-sm'>Claim</li>
                <li className='py-2 text-sm'>Policy</li>
                <li className='py-2 text-sm'>Terms</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;








/*
REFERENCES
===================
Code Commerce, 2022. React JS & Tailwind CSS Responsive Website - Beginner Friendly. [video online]. Avaliable at: https://www.youtube.com/watch?v=ZU-drSVodBw [Accessed 8 October 2025]

*/