import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useConfigStore } from '../../store/configStore';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { HeroEditor } from './editors/HeroEditor';
import { DemoEditor } from './editors/DemoEditor';
import { FeaturesEditor } from './editors/FeaturesEditor';
import { BenefitsEditor } from './editors/BenefitsEditor';
import { HowItWorksEditor } from './editors/HowItWorksEditor';
import { TestimonialsEditor } from './editors/TestimonialsEditor';
import { PricingEditor } from './editors/PricingEditor';
import { FaqEditor } from './editors/FaqEditor';
import { FinalCtaEditor } from './editors/FinalCtaEditor';

export const LandingPageEditor: React.FC = () => {
  const { config, updateLandingPage, saveConfig } = useConfigStore();

  const handleSave = () => {
    saveConfig();
    toast.success('Changes saved successfully!', {
      style: {
        background: '#1B1B21',
        color: '#D3D3DF',
        border: '1px solid rgba(195, 58, 255, 0.2)',
      },
      duration: 2000,
    });
  };

  return (
    <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#D3D3DF]">Landing Page Editor</h2>
        <Button
          onClick={handleSave}
          className="flex items-center gap-2 bg-purple-900 text-white hover:bg-purple-900/90"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Tabs.Root defaultValue="hero" className="space-y-6">
        <Tabs.List className="flex space-x-2 overflow-x-auto border-b border-purple-900/20">
          {[
            { value: 'hero', label: 'Hero' },
            { value: 'demo', label: 'Demo' },
            { value: 'features', label: 'Features' },
            { value: 'benefits', label: 'Benefits' },
            { value: 'howItWorks', label: 'How It Works' },
            { value: 'testimonials', label: 'Testimonials' },
            { value: 'pricing', label: 'Pricing' },
            { value: 'faq', label: 'FAQ' },
            { value: 'finalCta', label: 'Final CTA' },
          ].map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 text-[#D3D3DF] hover:text-purple-900 data-[state=active]:text-purple-900 data-[state=active]:border-b-2 data-[state=active]:border-purple-900 transition-colors whitespace-nowrap"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="overflow-y-auto max-h-[calc(100vh-300px)] pr-4 -mr-4">
          <Tabs.Content value="hero" className="text-[#D3D3DF]">
            <HeroEditor
              data={config.landingPage.hero}
              onChange={(hero) => updateLandingPage({ hero })}
            />
          </Tabs.Content>

          <Tabs.Content value="demo" className="text-[#D3D3DF]">
            <DemoEditor
              data={config.landingPage.demo}
              onChange={(demo) => updateLandingPage({ demo })}
            />
          </Tabs.Content>

          <Tabs.Content value="features" className="text-[#D3D3DF]">
            <FeaturesEditor
              data={config.landingPage.features}
              onChange={(features) => updateLandingPage({ features })}
            />
          </Tabs.Content>

          <Tabs.Content value="benefits" className="text-[#D3D3DF]">
            <BenefitsEditor
              data={config.landingPage.benefits}
              onChange={(benefits) => updateLandingPage({ benefits })}
            />
          </Tabs.Content>

          <Tabs.Content value="howItWorks" className="text-[#D3D3DF]">
            <HowItWorksEditor
              data={config.landingPage.howItWorks}
              onChange={(howItWorks) => updateLandingPage({ howItWorks })}
            />
          </Tabs.Content>

          <Tabs.Content value="testimonials" className="text-[#D3D3DF]">
            <TestimonialsEditor
              data={config.landingPage.testimonials}
              onChange={(testimonials) => updateLandingPage({ testimonials })}
            />
          </Tabs.Content>

          <Tabs.Content value="pricing" className="text-[#D3D3DF]">
            <PricingEditor
              data={config.landingPage.pricing}
              onChange={(pricing) => updateLandingPage({ pricing })}
            />
          </Tabs.Content>

          <Tabs.Content value="faq" className="text-[#D3D3DF]">
            <FaqEditor
              data={config.landingPage.faq}
              onChange={(faq) => updateLandingPage({ faq })}
            />
          </Tabs.Content>

          <Tabs.Content value="finalCta" className="text-[#D3D3DF]">
            <FinalCtaEditor
              data={config.landingPage.finalCta}
              onChange={(finalCta) => updateLandingPage({ finalCta })}
            />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};