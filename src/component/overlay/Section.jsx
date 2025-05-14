import { motion } from "framer-motion";

const Section = (props) => {
  const { children, mobileTop } = props;

  return (
    <motion.section
      className={`
        h-screen w-screen p-8 max-w-screen-2xl mx-auto
        flex flex-col text-center select-none
        ${mobileTop ? "justify-start md:justify-center" : "justify-center"}
      `}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.section>
  );
};

export default Section;
