import Home from "./Home";
import About from "./About";
import Armor from "./Armor";
export const Overlay = (props) => {
  const { setSection } = props;
  return (
    <>
    <Home />
    <About />
    <Armor />
    </>
  );
};
