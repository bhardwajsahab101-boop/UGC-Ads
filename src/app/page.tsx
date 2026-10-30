import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Process from '@/components/Process';
import WhyUs from '@/components/WhyUs';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Portfolio />
        <Services />
        <Pricing />
        <Process />
        <WhyUs />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
