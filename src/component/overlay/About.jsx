import { bigVador } from "../../assets";
import Section from "./Section";

const About = (props) => {
  const { setSection } = props;
  return (
    <Section mobileTop>
     <div className="flex self-center h-full items-center max-w-7xl justify-center flex-col lg:flex-row md:gap-10 lg:gap-12">
    <div className="">
        <h1 className="text-3xl text-center md:text-left md:text-5xl font-Jedi4 font-serif text-white">
         Anakin
        </h1>
      </div>
      <div className="w-72 h-72 md:w-96 md:h-96">
        <img src={bigVador} className="w-full h-full object-contain" />
      </div>
      <p className=" font-normal text-sm text-white py-2 w-[250px] md:w-[300px] text-left tracking-wide">
        Darth Vader, originally named Anakin Skywalker, was a skilled Jedi Knight in the Star Wars galaxy. 
        Seduced by the dark side of the Force due to fear and a desire for power, he became the apprentice of Emperor Palpatine.   
        </p>
      </div>
    </Section>
  );
};

export default About;
