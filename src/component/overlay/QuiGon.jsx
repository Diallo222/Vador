import { quigon } from "../../assets";
import Section from "./Section";

const QuiGon = (props) => {
  const { setSection } = props;
  return (
    <Section mobileTop>
     <div className="flex self-center h-full items-center max-w-7xl justify-center flex-col lg:flex-row md:gap-10 lg:gap-12">
     <p className=" font-normal text-sm md:text-lg text-white py-2 w-[250px] md:w-[400px] text-justify ">
      Recognizing Anakin's potential, Jedi Master Qui-Gon Jinn discovered him during a mission on Tatooine. 
      The Jedi sensed a strong connection to the Force within the young boy and believed him to be the Chosen One destined to bring balance.    
        </p>
        <div className="w-72 h-72 md:w-96 md:h-96">
        <img src={quigon} className="w-full h-full object-contain" />
      </div>
      </div>
    </Section>
  );
};

export default QuiGon;

