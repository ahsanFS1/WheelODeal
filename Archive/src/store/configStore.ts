import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PageConfig, Prize, LandingPageConfig } from '../types';

interface ConfigState {
  config: PageConfig;
  setConfig: (config: Partial<PageConfig>) => void;
  updatePrize: (prizeId: string, prize: Partial<Prize>) => void;
  updateLandingPage: (config: Partial<LandingPageConfig>) => void;
  saveConfig: () => void;
  savedConfig: PageConfig;
}

const defaultLandingPage: LandingPageConfig = {
  hero: {
    headline: "Turn Engagement Into Results With a Spinning Wheel of Fortune!",
    subheadline: "Attract, engage, and convert customers with the ultimate customizable landing page tool. Perfect for businesses of any size.",
    ctaButton: {
      text: "Try the Demo",
      color: "#C33AFF",
      textColor: "#FFFFFF",
      link: "#demo"
    },
    backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&q=80"
  },
  demo: {
    title: "See the Wheel in Action!",
    caption: "Watch how easy it is to create your personalized experience.",
    secondaryCta: {
      text: "Learn More",
      color: "#C33AFF",
      textColor: "#FFFFFF",
      link: "#video"
    }
  },
  features: {
    title: "Why Choose Us!",
    description: "Why Businesses Love Our Platform.",
    items: [
      {
        icon: "Settings",
        title: "Easy to Customize",
        description: "Personalize your wheel with your own branding, colors, prizes, and fonts."
      },
      {
        icon: "Smartphone",
        title: "Mobile Responsive",
        description: "Works seamlessly on all devices, ensuring accessibility for everyone."
      },
      {
        icon: "BarChart",
        title: "Analytics Included",
        description: "Track engagement, spins, and results with built-in analytics."
      }
    ]
  },
  benefits: {
    title: "The Benefits of Adding Gamification to Your Marketing Strategy!",
    description: "Our spinning wheel landing pages are more than just fun—they're proven to boost engagement, increase conversions, and build brand loyalty.",
    items: [
      "Boost user engagement by 70%",
      "Increase conversions and sales",
      "Delight your customers with rewards",
      "Simplify lead generation"
    ]
  },
  howItWorks: { 
    title: "How It Works",
    steps: [
      {
        icon: "Settings",
        title: "Customize Your Wheel",
        description: "Set up your prizes and branding"
      },
      {
        icon: "Share2",
        title: "Share With Your Audience",
        description: "Embed on your website or share the link"
      },
      {
        icon: "Trophy",
        title: "Watch Results Roll In",
        description: "Track engagement and conversions"
      }
    ]
  },
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Success stories from businesses like yours",
    items: [
      {
        id: "1",
        content: "This tool has transformed our lead generation process!",
        name: "John Smith",
        role: "Marketing Director",
        company: "Tech Corp",
        rating: 5
      }
    ]
  },
  pricing: {
    title: "Choose Your Plan",
    plans: [
      {
        id: "basic",
        name: "Basic",
        price: "$99/year",
        features: ["1 Landing Page"],
        buttonText: "Get Started",
        buttonColor: "#C33AFF",
        buttonTextColor: "#FFFFFF",
        buttonLink: "/signup"
      }
    ]
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        id: "1",
        question: "What is included in each plan?",
        answer: "Each plan includes access to all core features, customization options, analytics, and support."
      }
    ]
  },
  finalCta: {
    title: "Ready to Boost Your Engagement?",
    buttonText: "Get Started Now",
    buttonLink: "/user-dashboard",
    buttonColor: "#C33AFF",
    buttonTextColor: "#FFFFFF",
    guarantee: "30-day money-back guarantee"
  }
};

const defaultConfig: PageConfig = {
  landingPage: defaultLandingPage,
  prizes: [
    {
      id: '1',
      text: 'Free Coffee',
      color: '#FF5733',
      probability: 0.2,
      redirectUrl: 'https://example.com/free-coffee',
      glowColor: '#FFC300'
    },
    {
      id: '2',
      text: 'Discount Voucher',
      color: '#33FF57',
      probability: 0.3,
      redirectUrl: 'https://example.com/discount-voucher',
      glowColor: '#85FFBD'
    },
    {
      id: '3',
      text: 'Gift Card',
      color: '#3357FF',
      probability: 0.1,
      redirectUrl: 'https://example.com/gift-card',
      glowColor: '#85C1FF'
    },
    {
      id: '4',
      text: 'T-Shirt',
      color: '#FF33A1',
      probability: 0.15,
      redirectUrl: 'https://example.com/tshirt',
      glowColor: '#FFC1E3'
    },
    {
      id: '5',
      text: 'Free Lunch',
      color: '#FFD700',
      probability: 0.25,
      redirectUrl: 'https://example.com/free-lunch',
      glowColor: '#FFFF99'
    }
  ],
  backgroundColor: "#121218",
  logo: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Flogo-sample&psig=AOvVaw2SJuE632NFR4GhkbOmYNLo&ust=1732977082422000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOia-IbhgYoDFQAAAAAdAAAAABAE",
  headerTitle: "Spin & Win!",
  subtitle: "Try your luck and win amazing prizes!",
  carouselImages: [
    {
      url: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1920&q=80",
      alt: "Prize showcase 1"
    },
    {
      url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1920&q=80",
      alt: "Prize showcase 2"
    }
  ]
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: defaultConfig,
      savedConfig: defaultConfig,
      setConfig: (newConfig) =>
        set((state) => {
          const updatedConfig = { ...state.config, ...newConfig };
          return {
            config: updatedConfig,
            savedConfig: updatedConfig
          };
        }),
      updatePrize: (prizeId, prizeUpdate) =>
        set((state) => {
          const updatedPrizes = state.config.prizes.map((p) =>
            p.id === prizeId ? { ...p, ...prizeUpdate } : p
          );
          const updatedConfig = {
            ...state.config,
            prizes: updatedPrizes
          };
          return {
            config: updatedConfig,
            savedConfig: updatedConfig
          };
        }),
      updateLandingPage: (landingPageUpdate) =>
        set((state) => {
          const updatedConfig = {
            ...state.config,
            landingPage: {
              ...state.config.landingPage,
              ...landingPageUpdate
            }
          };
          return {
            config: updatedConfig,
            savedConfig: updatedConfig
          };
        }),
      saveConfig: () =>
        set((state) => ({
          config: state.config,
          savedConfig: state.config
        }))
    }),
    {
      name: 'wheel-config',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        config: state.config,
        savedConfig: state.config
      })
    }
  )
);

export const useSavedConfig = () => {
  return useConfigStore((state) => state.savedConfig);
};