import React , {useState , useEffect , useRef} from "react";
import { motion } from "framer-motion";

const TextTypingEffect = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");
    const intervalRef = useRef(null);
    const typText =()=>{
        let currentIndex = 0;
        intervalRef.current = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval( intervalRef.current);
          }
        }, 50); // Adjust typing speed by changing the interval duration
    
        return () => clearInterval( intervalRef.current);
    }

    const stopTyping =()=>{
        clearInterval(intervalRef.current || undefined);

        setDisplayedText(text);
    }
  
    // useEffect(() => {
    //   let currentIndex = 0;
    //   const interval = setInterval(() => {
    //     if (currentIndex <= text.length) {
    //       setDisplayedText(text.slice(0, currentIndex));
    //       currentIndex++;
    //     } else {
    //       clearInterval(interval);
    //     }
    //   }, 200); // Adjust typing speed by changing the interval duration
  
    //   return () => clearInterval(interval);
    // }, [text]);
  
    return (
      <motion.span
      onViewportEnter={typText}
      onViewportLeave={stopTyping}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="font-normal text-sm md:text-lg text-white py-2 w-[250px] md:w-[400px] text-justify"
      >
        {displayedText}
      </motion.span>
    );
  };

  export default TextTypingEffect;