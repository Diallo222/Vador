import { motion } from "framer-motion";

const Section = (props) => {
  const { children, mobileTop } = props;
  //   ${mobileTop ? "justify-start md:justify-center" : "justify-center"}
  return (
    <motion.section
      className={`
    h-screen w-screen p-8 max-w-screen-2xl mx-auto
    flex flex-col text-center select-none
  
    `}
      // initial={{
      //   opacity: 0,
      //   y: 50,
      // }}
      // whileInView={{
      //   opacity: 1,
      //   y: 0,
      //   transition: {
      //     duration: 1,
      //     delay: 0.6,
      //   },
      // }}
      // ces animations cause des erreurs
    >
      {children}
    </motion.section>
  );
};

export default Section;
