// pages/Home.jsx
import React from "react";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/About/About";

const Home = () => {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection/>
    </>
  );
};

export default Home;
