import Section from "./Section";

const Home = (props) => {
  const { setSection } = props;
  return (
    <Section mobileTop>
     <div className="flex w-full h-full items-center ">
    <div className="self-center">
        <h1 className="text-5xl text-center md:text-left md:text-6xl md:pl-20 font-Jedi4 font-serif text-white drop-shadow-md">
          Darth Vader
        </h1>
        <p className="font-Jedi4 text-white text-2xl md:pl-20 py-2 drop-shadow-sm">welcome to the dark side</p>
      </div>
      </div>
    </Section>
  );
};

export default Home;
