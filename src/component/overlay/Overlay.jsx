import Home from "./Home";
import About from "./About";
export const Overlay = (props) => {
  const { setSection } = props;
  return (
    <>
    <Home />
    <About />
    </>
  );
};
