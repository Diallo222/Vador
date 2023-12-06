import { bigVador } from "../../assets";
import Section from "./Section";

const Armor = (props) => {
  const { setSection } = props;
  return (
    <Section>
     <div className="flex h-full items-center md:items-start max-w-7xl justify-center flex-col ">
    <div className="">
    <h1 className="text-5xl text-center md:text-left md:text-6xl md:pl-20 font-Jedi4 font-serif text-white drop-shadow-md">
          Sith Master
        </h1>
      </div>
      <p className=" font-normal text-sm text-white py-2 w-[250px] md:w-[500px]  md:pl-20 text-left tracking-wide">
      Clad in black armor and wielding a red lightsaber, Vader became a symbol of the Galactic Empire's oppression.   
        </p>
      </div>
    </Section>
  );
};

export default Armor;
