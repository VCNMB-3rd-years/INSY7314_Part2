import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero'; {/*Code Commerce, 2022*/}
export default function WelcomePage() {
    const navigate = useNavigate();

    const handleNavigateToPayPortal = () => {
        navigate('/paymentPortal');
    };

    return (
        
        <div className="flex flex-col items-center justify-center h-screen bg-teal-50 text-gray-800 font-sans p-4 relative overflow-hidden">
            
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#8DAB7F] rounded-full opacity-50"></div>
            <div className="absolute -bottom-16 -right-10 w-48 h-48 bg-[#587B7F] rounded-full opacity-40"></div>
        
             <div className="flex flex-col items-center justify-center pt-24 pb-12 px-4 z-10">
                <div className="text-center p-8 sm:p-12 rounded-2xl shadow-xl bg-white/70 backdrop-blur-lg z-10 max-w-md w-full mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#394032] mb-3">
                        Welcome To PayNow
                    </h1>
                </div>

                {/*Code Commerce, 2022*/}
                <Hero />

            </div>
        </div>
    );
}


/*
REFERENCES
===================
Code Commerce, 2022. React JS & Tailwind CSS Responsive Website - Beginner Friendly. [video online]. Avaliable at: https://www.youtube.com/watch?v=ZU-drSVodBw [Accessed 8 October 2025]
Web Dev Simplified, 2022. How To Create A Navbar In React With Routing. [video online]. Avaliable at: https://www.youtube.com/watch?v=SLfhMt5OUPI [Accessed 8 October 2025]

*/