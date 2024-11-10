import { motion } from "framer-motion";

import {young } from "../../assets";
import Section from "./Section";

const About = (props) => {
  const { setSection } = props;

  return (
    <Section mobileTop>
     <div className="flex self-center h-full items-center max-w-7xl justify-center flex-col  md:gap-2 lg:gap-4">
    
        <h1 className="text-3xl text-center md:text-left md:text-7xl font-Jedi4 font-serif text-red-600">
         Origins
        </h1>
      <div  className="flex flex-col lg:flex-row justify-center items-center md:gap-10 lg:gap-12">
      <motion.p
       initial={{ opacity: 0 }}
       whileInView={{ opacity: 1 }}
       transition={{ duration: 0.8 }}
      className=" font-normal text-sm md:text-lg text-white py-2 w-[250px] md:w-[400px] text-left ">
        Darth Vader, originally named Anakin Skywalker,and Born to Shmi Skywalker, 
        he entered the galaxy without a known father, leading to rumors of a miraculous conception. 
        Growing up as a slave, Anakin displayed exceptional mechanical aptitude and podracing skills, 
        catching the attention of those around him.  
        </motion.p>
       
        <div className="w-72 h-72 md:w-96 md:h-96">
        <img src={young} className="w-full h-full object-contain" />
      </div>
      </div>
      </div>
    </Section>
  );
};

export default About;
