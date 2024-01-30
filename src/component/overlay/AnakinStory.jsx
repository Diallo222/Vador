import Section from "./Section";

const AnakinStory = (props) => {
  return (
    <Section>
     <div className="flex h-full items-center md:items-start max-w-7xl justify-center flex-col ">
    <div className="">
    <h1 className="text-5xl text-center md:text-left md:text-6xl md:pl-20 font-Jedi4 font-serif text-white drop-shadow-md">
        Prodigious Jedi
        </h1>
      </div>
      <p className=" font-normal text-sm md:text-base text-white py-2 md:pl-20 w-[250px] md:w-[600px] text-left tracking-wide">
      Blessed with unparalleled piloting skills and a deep connection to the Force,
       embarked on a journey with the prophetic promise of bringing balance to the galaxy. 
       From the outset, his destiny seemed intertwined with the fate of the cosmos, 
       as whispers of a Chosen One echoed through the Jedi Order.
        </p>
      </div>
    </Section>
  );
};

export default AnakinStory;
