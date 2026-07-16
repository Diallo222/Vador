import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  mobileTop?: boolean;
}

const Section = ({ children, mobileTop }: SectionProps) => {
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
