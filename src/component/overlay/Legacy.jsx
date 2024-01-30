import Section from "./Section";

const Legacy = (props) => {
  const { setSection } = props;
  return (
    <Section>
     <div className="flex h-full items-center md:items-start max-w-7xl justify-center flex-col ">
    <div className="">
    <h1 className="text-5xl text-center md:text-left md:text-6xl md:pl-20 font-Jedi4 font-serif text-red-600 drop-shadow-md">
          Legacy
        </h1>
      </div>
      <p className=" font-normal text-sm md:text-base text-white py-2 w-[250px] md:w-[500px]  md:pl-20 text-left tracking-wide">
      Darth Vader's legacy endures, symbolizing both the tyranny of the Empire and the potential for redemption, 
      leaving an indelible mark on the Star Wars saga. His iconic helmet and breathing apparatus continue to represent the complex journey from hero to villain to savior, 
      resonating through generations of fans.   
        </p>
      </div>
    </Section>
  );
};

export default Legacy;
