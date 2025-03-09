
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeatureSection />
      
      {/* Testimonial Section */}
      <section className="py-16 md:py-24 container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground">
            Join thousands of users who are improving their financial wellness with Albert.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Albert has saved Simulations Club!",
              author: "Ashwin M.",
              role: "Treasurer of Simulations Club",
            },
            {
              quote: "I love Albert!",
              author: "Akshaya L.",
              role: "Albert's #2 Fan",
            },
            {
              quote: "I love Albert even more!",
              author: "Nayel R.",
              role: "Albert's #1 Fan",
            },
          ].map((testimonial, index) => (
            <div key={index} className="glass-card p-6 rounded-xl">
              <div className="text-lg italic mb-4">{testimonial.quote}</div>
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-albert-500/20 flex items-center justify-center">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 container mx-auto px-6">
        <div className="rounded-2xl bg-gradient-to-b from-secondary to-card p-8 md:p-12 border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-albert-500/10 rounded-full blur-[60px]"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-accent/10 rounded-full blur-[60px]"></div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your financial health?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who are taking control of their finances with Albert's intelligent platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button variant="outline" onClick={() => window.location.href='/dashboard'} className="h-12 px-6 rounded-lg">
                Get Started
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
              {[
                "No credit card required",
                "Free basic account",
                "Cancel anytime",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-albert-400 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
