import { log } from './logger';

const LANDING_COMPONENT = 'Landing';

export const landingLogger = {
  viewSection: (section: string) => {
    log(LANDING_COMPONENT, `User viewed ${section} section`);
  },
  
  hoverPlan: (planName: string) => {
    log(LANDING_COMPONENT, `User hovered pricing plan`, { plan: planName });
  },
  
  clickCTA: (buttonType: string, destination: string) => {
    log(LANDING_COMPONENT, `User clicked CTA button`, { type: buttonType, destination });
  },
  
  clickPricingCTA: (planName: string, destination: string) => {
    log(LANDING_COMPONENT, `User clicked pricing CTA`, { plan: planName, destination });
  },
  
  featureInteraction: (featureTitle: string, type: 'view' | 'hover') => {
    log(LANDING_COMPONENT, `User ${type}ed feature`, { feature: featureTitle });
  },
  
  workflowStepView: (stepTitle: string) => {
    log(LANDING_COMPONENT, `User viewed workflow step`, { step: stepTitle });
  },
  
  testimonialView: (authorName: string) => {
    log(LANDING_COMPONENT, `User viewed testimonial`, { author: authorName });
  }
};