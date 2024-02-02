import Section from "./Section";

const Monster = (props) => {
  const { setSection } = props;
  return (
    <Section>
     <div className="flex h-full items-center  w-full mt-5 justify-center flex-col ">
    <div className="">
    <h1 className="text-5xl text-center md:text-left md:text-6xl font-Jedi4 font-serif text-red-600 drop-shadow-md">
    The Galactic Empire
        </h1>
      </div>
      <p className=" font-normal text-sm md:text-lg text-white py-2 w-[250px] md:w-[800px] text-justify">
      Darth Vader played a pivotal role in the rise of the oppressive Galactic Empire, 
      enforcing the Emperor's rule with an iron fist. 
      His imposing presence and mastery of the Force struck terror into the hearts of those who dared to oppose the Empire, 
      solidifying his status as a formidable enforcer.   
        </p>
      </div>
    </Section>
  );
};

export default Monster;
