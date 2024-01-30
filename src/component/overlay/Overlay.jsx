import Home from "./Home";
import About from "./About";
import AnakinStory from "./AnakinStory";
import Armor from "./Armor";
import QuiGon from "./QuiGon";
import Monster from "./Monster";
import Redemption from "./Redemption";
import Legacy from "./Legacy";
export const Overlay = (props) => {
  const { setSection } = props;
  return (
    <>
    <Home />
    <About />
    <QuiGon />
    <AnakinStory />
    <Armor />
    <Monster />
    <Redemption />
    <Legacy />
    
    </>
  );
};
