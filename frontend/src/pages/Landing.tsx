import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Trusted from "../components/landing/Trusted";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";
import Testimonials from "../components/landing/Testimonials";
import Pricing from "../components/landing/Pricing";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Trusted />
      <Stats />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}