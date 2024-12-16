// import Image from "next/image";

import Popular from "./Components/Popular";
import Recomended from "./Components/Recomended";
import Selector from "./Components/Selector";
import Hero from "./Components/Hero";
import Header2 from "./Components/Header2"

export default function Home(){
  return(
    <>
    <Header2/>
    <Hero/>
    <Selector/>
    <Popular/>
    <Recomended/>
    </>
  )
}