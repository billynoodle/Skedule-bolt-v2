import React from 'react';
import { Hero } from '../components/landing/Hero';
import { WorkflowSteps } from '../components/landing/WorkflowSteps';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { Pricing } from '../components/landing/Pricing';
import { CallToAction } from '../components/landing/CallToAction';
import { Footer } from '../components/layout/Footer';

export function Landing() {
  return (
    <>
      <Hero />
      <WorkflowSteps />
      <Features />
      <Testimonials />
      <Pricing />
      <CallToAction />
      <Footer />
    </>
  );
}