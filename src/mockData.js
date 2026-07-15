// Premium Mock Resume Data and Parsing Simulation

export const mockResumes = {
  softwareEngineer: {
    name: "Alex Rivera",
    email: "alex.rivera@devmail.io",
    phone: "+1 (555) 382-9104",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS", "Next.js", "Docker", "AWS", "Python", "PostgreSQL"],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "B.S. in Computer Science",
        year: "2018 - 2022"
      },
      {
        institution: "Y Combinator Startup School",
        degree: "Product & Engineering Micro-credential",
        year: "2023"
      }
    ],
    experience: [
      {
        company: "Vercel",
        role: "Senior Frontend Engineer",
        duration: "2024 - Present",
        description: "Leading frontend architecture for Next.js developer tools. Optimized build dashboard rendering speed by 42% using concurrent React features. Mentored 4 junior engineers."
      },
      {
        company: "Linear App",
        role: "Software Engineer",
        duration: "2022 - 2024",
        description: "Built keyboard shortcut system and offline synchronization features. Implemented ultra-responsive flat lists that render 10,000+ items smoothly at 60fps."
      }
    ],
    projects: [
      {
        title: "DevFlow Editor",
        techStack: "React, WebAssembly, Rust",
        description: "A lightning-fast web-based code editor with a built-in interactive compiler. Grew to 5,000+ monthly active developers on GitHub."
      },
      {
        title: "FlatUI Component Library",
        techStack: "Tailwind CSS, TypeScript",
        description: "A lightweight, premium component library designed around flat aesthetics and soft shadows. Used in over 50 production SaaS products."
      }
    ],
    summary: "Senior Frontend Engineer with 4+ years of experience specializing in high-performance web applications, Developer Experience (DX), and modern design systems. Passionate about building minimal, responsive interfaces with clean user flows."
  },

  productDesigner: {
    name: "Sarah Chen",
    email: "sarah.chen@designstudio.co",
    phone: "+1 (555) 492-2384",
    skills: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "Framing", "Webflow", "CSS Grid", "User Research", "Visual Identity"],
    education: [
      {
        institution: "Rhode Island School of Design (RISD)",
        degree: "B.F.A. in Industrial & Interaction Design",
        year: "2017 - 2021"
      }
    ],
    experience: [
      {
        company: "Stripe",
        role: "Senior Product Designer",
        duration: "2023 - Present",
        description: "Designing the next generation of developer dashboard checkout components. Created and maintained the unified design system tokens, reducing designer-to-developer handoff time by 30%."
      },
      {
        company: "Notion",
        role: "Product Designer",
        duration: "2021 - 2023",
        description: "Designed core collaborative workspace features. Iterated on block creation menus and workspace template directories based on user testing and qualitative feedback loops."
      }
    ],
    projects: [
      {
        title: "Scribe Design System",
        techStack: "Figma Variables, Design Tokens",
        description: "A completely open-source UI design system built around flat color palettes and extreme spacing clarity. Over 12k downloads on Figma Community."
      },
      {
        title: "Portfolius CMS",
        techStack: "Webflow, Javascript",
        description: "A highly customizable portfolio framework for creatives, focusing on rapid responsiveness and ultra-clean flat layouts."
      }
    ],
    summary: "Detail-oriented Product Designer with a strong engineering affinity. Dedicated to creating high-fidelity prototypes, scalable design systems, and intuitive customer-facing checkout flows. Heavy focus on spacing, typography, and clean flat styles."
  },

  marketingSpecialist: {
    name: "Marcus Vance",
    email: "marcus.v@growthlabs.com",
    phone: "+1 (555) 819-3729",
    skills: ["SaaS Growth", "SEO Strategy", "Copywriting", "Google Analytics", "Email Campaigns", "Product Led Growth", "A/B Testing", "CSS/HTML"],
    education: [
      {
        institution: "University of Pennsylvania (Wharton)",
        degree: "B.S. in Economics (Marketing & Finance)",
        year: "2016 - 2020"
      }
    ],
    experience: [
      {
        company: "Linear",
        role: "Growth Marketing Lead",
        duration: "2022 - Present",
        description: "Grew organic developer signups by 150% year-over-year. Orchestrated high-converting content marketing strategies and designed SEO landing pages utilizing sleek flat UI elements."
      },
      {
        company: "Vercel",
        role: "Product Marketing Manager",
        duration: "2020 - 2022",
        description: "Managed public launches of Next.js versions. Created landing page copy, visual animations, and coordinated developer outreach campaigns generating 100k+ concurrent viewers."
      }
    ],
    projects: [
      {
        title: "SaaS Copywriting Playbook",
        techStack: "Markdown, Notion",
        description: "An interactive, open-source guide compiling high-performing headers and structural formulas for SaaS landing pages. 8,000+ views."
      },
      {
        title: "RankHigher Tool",
        techStack: "Next.js, Tailwind CSS",
        description: "A minimal dashboard tracking page structure, semantic SEO hierarchies, and keyword density. Clean flat interface design."
      }
    ],
    summary: "Metrics-driven Growth Marketer specializing in developer tools and B2B SaaS. Expert in translating complex technical features into clear, high-converting copy and running target-oriented organic growth campaigns."
  }
};

// Utility to clean up filenames and extract a name
function extractNameFromFilename(filename) {
  if (!filename) return null;
  // Remove extension
  let name = filename.replace(/\.[^/.]+$/, "");
  // Replace symbols with spaces
  name = name.replace(/[_-]/g, " ");
  // Capitalize first letters of words
  name = name.replace(/\b\w/g, c => c.toUpperCase());
  
  // Clean common words like 'resume', 'cv', 'final', '2026', etc.
  const ignoreWords = ["Resume", "Cv", "Final", "2026", "2025", "2024", "Pdf", "Word", "New", "Clean", "Job"];
  ignoreWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    name = name.replace(regex, "");
  });
  
  // Trim spaces and filter empty
  name = name.trim().replace(/\s+/g, " ");
  return name.length > 2 ? name : null;
}

export function parseResumeMock(filename) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerFile = filename.toLowerCase();
      let profile = { ...mockResumes.softwareEngineer }; // Default
      
      if (lowerFile.includes("design") || lowerFile.includes("ui") || lowerFile.includes("ux") || lowerFile.includes("art") || lowerFile.includes("creative")) {
        profile = { ...mockResumes.productDesigner };
      } else if (lowerFile.includes("market") || lowerFile.includes("sales") || lowerFile.includes("growth") || lowerFile.includes("biz")) {
        profile = { ...mockResumes.marketingSpecialist };
      }
      
      // Override name if we can parse it from filename
      const parsedName = extractNameFromFilename(filename);
      if (parsedName) {
        profile.name = parsedName;
        // Generate a matching email
        const emailSlug = parsedName.toLowerCase().replace(/\s+/g, ".");
        profile.email = `${emailSlug}@example.com`;
      }
      
      resolve(profile);
    }, 2000); // 2 second delay to simulate realistic backend parse
  });
}
