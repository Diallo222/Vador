import { redemption} from "../../assets";
import Section from "./Section";

const Redemption = (props) => {
  const { setSection } = props;
  return (
    <Section mobileTop>
     <div className="flex self-center h-full items-center max-w-7xl justify-center flex-col lg:flex-row md:gap-10 lg:gap-12">
    <div className="">
        <h1 className="text-3xl text-center md:text-left md:text-5xl font-Jedi4 font-serif text-red-600">
         Redemption
        </h1>
      </div>
      <p className=" font-normal text-sm md:text-base text-white py-2 w-[250px] md:w-[300px] text-left tracking-wide">
      In a final act of redemption, Vader turned against the Emperor to save his son, 
      Luke, sacrificing himself to destroy the Sith and bring balance to the Force. 
      His selfless choice in the face of darkness highlighted the enduring spark of good within, ultimately fulfilling the prophecy of the Chosen One.  
        </p>
        <div className="w-72 h-72 md:w-96 md:h-96">
        <img src={redemption} className="w-full h-full object-contain" />
      </div>
      </div>
    </Section>
  );
};

export default Redemption;
