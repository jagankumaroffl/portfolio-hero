"use client";

import { useCallback, useState } from "react";
import Loader from "@/components/loader/Loader";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Projects from "@/components/projects/Projects";
import Journey from "@/components/journey/Journey";
import Toolbox from "@/components/toolbox/Toolbox";
import Lab from "@/components/lab/Lab";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";


import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { useLoader } from "@/hooks/useLoader";

export default function Home() {
  const loading = useLoader();

  const [, setAboutNode] = useState<HTMLElement | null>(null);
  const aboutRef = useCallback((node: HTMLElement | null) => {
    setAboutNode(node);
  }, []);

  return (
    <SmoothScrollProvider locked={loading}>
      <Loader loading={loading} />
      <Hero />
      <About ref={aboutRef} />
      <Projects />
      <Journey />
      <Toolbox />
      <Lab />
      <Contact />
      <Footer /> 
      
    </SmoothScrollProvider>
  );
}