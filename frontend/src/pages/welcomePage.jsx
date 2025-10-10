import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero'; {/*Code Commerce, 2022*/}
import iconPay from '../../image/icon.png'
import fast from '../../image/fast.png'
import secure from '../../image/secure.png'
import split from '../../image/split.png'
import border from '../../image/border.png'

export default function WelcomePage() {
    const navigate = useNavigate();

    const handleNavigateToPayPortal = () => {
        navigate('/paymentPortal');
    };

    return (
        
        <div className="flex flex-col items-center justify-center min-h-screen bg-teal-50 text-gray-800 font-sans p-4 relative overflow-hidden">
            
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#8DAB7F] rounded-full opacity-50"></div>
            <div className="absolute -bottom-16 -right-10 w-48 h-48 bg-[#587B7F] rounded-full opacity-40"></div>
        
             <div className="flex flex-col items-center justify-center pt-24 pb-12 px-4 z-10">
                <div className="text-center p-8 sm:p-12 rounded-2xl shadow-xl bg-white/70 backdrop-blur-lg z-10 max-w-md w-full mb-12">
                   {/*React Native, 2025*/}
                   <img
                        src={iconPay}
                        alt="PayNow Icon"
                        className="mx-auto mb-2" 
                        style={{ width: 200, height: 150 }} 
                    />              
                   
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#394032] mb-3">
                        Welcome To PayNow
                    </h1>
                </div>

                {/*Code Commerce, 2022*/}
                <Hero />


                {/*Stack Overflow, 2019 */}
                <div className="flex flex-row items-center justify-center w-full max-w-2xl mt-8 gap-4 px-4 flex-grow">
                    <img
                        src={border}
                        alt="Swift Payment Actions"
                        className="w-20 h-20 object-contain flex-shrink-0"
                    />
                   
                </div>
            </div>
        </div>
    );
}


/*
REFERENCES
===================
Code Commerce, 2022. React JS & Tailwind CSS Responsive Website - Beginner Friendly. [video online]. Avaliable at: https://www.youtube.com/watch?v=ZU-drSVodBw [Accessed 8 October 2025]
React Native, 2025. Image. [Online]. Available at: https://reactnative.dev/docs/image
Stack Overflow, 2019. Rendering two images in one row react native. [Online]. Available at: https://stackoverflow.com/questions/58955395/rendering-two-images-in-one-row-react-native [Accessed 8 October 2025]
Web Dev Simplified, 2022. How To Create A Navbar In React With Routing. [video online]. Avaliable at: https://www.youtube.com/watch?v=SLfhMt5OUPI [Accessed 8 October 2025]
*/