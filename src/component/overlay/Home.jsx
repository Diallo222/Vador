import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import Section from "./Section";

gsap.registerPlugin(ScrollTrigger , TextPlugin);

const Home = (props) => {

  const container = useRef();

useGSAP(() => {
    gsap.from(".box", {opacity: 0, stagger: 0.8});
}, { scope: container });
  return (
    <Section mobileTop>
     <div className="flex w-full h-full items-center ">
    <div ref={container} className="self-center">
        <h1 className="text-5xl text-center md:text-left md:text-6xl md:pl-20 font-Jedi4 font-serif text-white drop-shadow-md box">
          Darth Vader
        </h1>
        <p className="font-Jedi4 text-white text-2xl md:pl-20 py-2 drop-shadow-sm  box">welcome to the dark side</p>
      </div>
      </div>
    </Section>
  );
};

export default Home;
