
import Section from "./Section";

const Armor = (props) => {
  const { setSection } = props;
  return (
    <Section>
     <div className="flex h-full items-center md:items-start max-w-7xl justify-center flex-col ">
    <div className="">
    <h1 className="text-5xl text-center md:text-left md:text-6xl md:pl-20 font-Jedi4 font-serif text-red-600 drop-shadow-md">
          Sith Master
        </h1>
      </div>
      <p className=" font-normal text-sm md:text-base text-white py-2 w-[250px] md:w-[500px]  md:pl-20 text-left tracking-wide">
      Seduced by fear and anger, Anakin succumbed to the dark side, 
      becoming Darth Vader under the influence of Emperor Palpatine. 
      His fall marked a tragic shift from the Chosen One to a Sith Lord, 
      driven by a desperate quest for power and a fear of loss.   
        </p>
      </div>
    </Section>
  );
};

export default Armor;
