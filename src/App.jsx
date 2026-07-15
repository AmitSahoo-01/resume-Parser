import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  ArrowRight, 
  CheckCircle, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Layout, 
  Terminal, 
  Cpu, 
  Database, 
  FileJson,
  Layers,
  Sparkles,
  Smartphone,
  Eye,
  HelpCircle,
  Clock,
  Settings,
  Shield,
  Zap,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  FolderGit
} from 'lucide-react';
import { parseResumeMock } from './mockData';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function App() {
  // App States
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState(0); // 0: Idle, 1: Extracting text, 2: AI structuring, 3: Completed
  const [parsedData, setParsedData] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' | 'json'
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('softwareEngineer'); // Track simulated profile before upload
  const [notification, setNotification] = useState(null);
  
  const fileInputRef = useRef(null);
  const previewSectionRef = useRef(null);

  // Default initial profile to show in the preview section
  const [currentProfile, setCurrentProfile] = useState({
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
  });

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  // Main file processing logic
  const processFile = async (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      showNotification("Please upload a valid PDF resume.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showNotification("File size exceeds the 5MB limit.");
      return;
    }

    setFile(selectedFile);
    setIsParsing(true);
    setParsingStep(1); // Extracting raw text

    // Scroll to the preview/parsing section
    setTimeout(() => {
      previewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);

    // Step 2: Extract text simulation
    setTimeout(() => {
      setParsingStep(2); // AI Parsing / Structuring
    }, 1000);

    try {
      // Backend check & call
      let data = null;
      try {
        const formData = new FormData();
        formData.append('resume', selectedFile);
        
        const response = await fetch('http://localhost:5000/api/parse', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          data = await response.json();
          showNotification("Parsed successfully using backend AI.");
        }
      } catch (err) {
        // Backend not running, fall back to mock data
        console.log("Backend not detected, falling back to browser simulator...");
      }

      if (!data) {
        data = await parseResumeMock(selectedFile.name);
        showNotification("Demo Mode: Parsed successfully using browser simulation.");
      }

      // Step 3: Finished
      setTimeout(() => {
        setCurrentProfile(data);
        setIsParsing(false);
        setParsingStep(3);
      }, 1000);

    } catch (error) {
      console.error(error);
      setIsParsing(false);
      showNotification("An error occurred while parsing the resume.");
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current.click();
  };

  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  // FAQs data
  const faqs = [
    {
      q: "Which file formats are supported?",
      a: "Currently, we specialize in high-fidelity PDF resume parsing to ensure maximum layout preservation. Support for DOCX is planned in an upcoming release."
    },
    {
      q: "Is my data stored?",
      a: "No, your privacy is our priority. Resumes are processed in memory and instantly returned. We do not persist your files or parsed JSON data on any server."
    },
    {
      q: "How accurate is parsing?",
      a: "By combining PyMuPDF for raw text extraction and Google Gemini's advanced LLM understanding, we achieve over 98% accuracy on modern resume layouts, including multi-column formats."
    },
    {
      q: "Can I upload multiple resumes?",
      a: "Our core API supports batch parsing. For the landing page demonstration, we limit uploads to one resume at a time to keep processing speeds ultra-fast."
    },
    {
      q: "Does it use AI?",
      a: "Yes, we use the Google Gemini API with structured schema JSON output. It intelligently maps variations in job titles, date formats, and separates skills into clear technical sections."
    }
  ];

  // Features data
  const features = [
    { title: "PDF Upload", desc: "Drag and drop any PDF resume. Instant rendering and upload under 5MB.", icon: Upload },
    { title: "Smart Text Extraction", desc: "Extracts underlying text streams cleanly, bypassing columns and graphic divides.", icon: FileText },
    { title: "Name Detection", desc: "Identifies candidate name precisely even in unique header layouts.", icon: User },
    { title: "Email Detection", desc: "Parses email addresses and verifies string structure formatting.", icon: Mail },
    { title: "Phone Detection", desc: "Captures international and local telephone numbers with ease.", icon: Phone },
    { title: "Skills Extraction", desc: "Discovers tech stacks and soft skills, listing them as searchable tags.", icon: Code },
    { title: "Education Parsing", desc: "Extracts degrees, majors, colleges, and graduation timelines.", icon: GraduationCap },
    { title: "Experience Detection", desc: "Identifies companies, job titles, tenures, and bulleted achievements.", icon: Briefcase },
    { title: "Projects Detection", desc: "Extracts personal projects, portfolios, and matching tech stacks.", icon: FolderGit },
    { title: "Clean JSON Output", desc: "Returns developer-friendly, fully-structured JSON payloads.", icon: FileJson },
    { title: "AI Summary", desc: "Generates an intelligent executive summary based on overall experience.", icon: Sparkles },
    { title: "Fast Processing", desc: "Get comprehensive parsed metrics in under 3 seconds per file.", icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent selection:text-white font-sans overflow-x-hidden relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-card border border-customBorder rounded-2xl px-6 py-4 shadow-premium flex items-center gap-3 text-sm text-white"
          >
            <div className="w-2 h-2 rounded-full bg-accent" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-md border-b border-customBorder transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-white text-lg">
              R
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              AI Resume Parser
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-sm font-medium text-mutedText hover:text-white transition-colors duration-200">Home</a>
            <a href="#workflow" className="text-sm font-medium text-mutedText hover:text-white transition-colors duration-200">Workflow</a>
            <a href="#features" className="text-sm font-medium text-mutedText hover:text-white transition-colors duration-200">Features</a>
            <a href="#faq" className="text-sm font-medium text-mutedText hover:text-white transition-colors duration-200">FAQ</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-mutedText hover:text-white transition-colors duration-200 flex items-center gap-1">
              GitHub <ArrowRight className="w-3.5 h-3.5 rotate-[-45deg]" />
            </a>
          </nav>

          <button 
            onClick={triggerUploadClick}
            className="bg-accent hover:bg-accent/90 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] soft-shadow"
          >
            Upload Resume
          </button>
        </div>
      </header>

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="application/pdf" 
        className="hidden" 
      />

      {/* Hero Section */}
      <section id="hero" className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:py-32 grid md:grid-cols-12 gap-16 items-center">
        
        {/* Left Side Info */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="md:col-span-7 flex flex-col items-start text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-customBorder bg-card text-xs font-semibold tracking-wide text-accent mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            POWERED BY GOOGLE GEMINI 1.5
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.08] mb-6">
            Extract Resume Information <br className="hidden lg:block"/>in Seconds
          </h1>
          
          <p className="text-base sm:text-lg text-mutedText leading-relaxed mb-8 max-w-xl">
            Upload any PDF resume and instantly extract structured information like name, contact details, education, experience, skills, and projects using AI-powered resume parsing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={triggerUploadClick}
              className="bg-accent hover:bg-accent/90 text-white text-base font-semibold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] soft-shadow"
            >
              Upload Resume
              <Upload className="w-5 h-5" />
            </button>
            <a 
              href="#workflow"
              className="border border-customBorder hover:border-white text-white bg-transparent text-base font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-center hover:bg-white/5"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Right Side Upload Area + Floating Cards */}
        <div className="md:col-span-5 relative flex justify-center items-center">
          
          {/* Main Upload Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-sm bg-card border-[1.5px] rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 relative ${
              isDragging 
                ? 'border-accent bg-accent/5 scale-[1.02]' 
                : 'border-customBorder hover:border-white/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px] rounded-3xl" />

            <div className="w-16 h-16 rounded-2xl bg-background border border-customBorder flex items-center justify-center mb-6">
              <Upload className="w-7 h-7 text-accent" />
            </div>

            <h3 className="font-display font-bold text-lg mb-2 text-white">
              Drag & Drop Resume
            </h3>
            
            <p className="text-xs text-mutedText mb-6 max-w-[200px] leading-relaxed">
              Supports standard resume PDF documents. Maximum size 5MB.
            </p>

            <button 
              onClick={triggerUploadClick}
              className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] soft-shadow"
            >
              Select PDF File
            </button>
          </motion.div>

          {/* Floating cards */}
          <motion.div 
            variants={floatAnimation}
            animate="animate"
            className="absolute -top-6 -left-8 bg-card border border-customBorder rounded-2xl py-2.5 px-4 flex items-center gap-2 shadow-soft hover:border-accent/40 transition-colors duration-300"
          >
            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="text-xs font-semibold text-white">Skills Extracted</span>
          </motion.div>

          <motion.div 
            variants={floatAnimation}
            animate="animate"
            transition={{ delay: 1.2 }}
            className="absolute top-20 -right-8 bg-card border border-customBorder rounded-2xl py-2.5 px-4 flex items-center gap-2 shadow-soft hover:border-accent/40 transition-colors duration-300"
          >
            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="text-xs font-semibold text-white">Education</span>
          </motion.div>

          <motion.div 
            variants={floatAnimation}
            animate="animate"
            transition={{ delay: 2.4 }}
            className="absolute bottom-16 -left-12 bg-card border border-customBorder rounded-2xl py-2.5 px-4 flex items-center gap-2 shadow-soft hover:border-accent/40 transition-colors duration-300"
          >
            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="text-xs font-semibold text-white">Experience</span>
          </motion.div>

          <motion.div 
            variants={floatAnimation}
            animate="animate"
            transition={{ delay: 0.6 }}
            className="absolute -bottom-8 right-0 bg-card border border-customBorder rounded-2xl py-2.5 px-4 flex items-center gap-2 shadow-soft hover:border-accent/40 transition-colors duration-300"
          >
            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="text-xs font-semibold text-white">Contact Details</span>
          </motion.div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="border-t border-customBorder bg-[#232625] py-24">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-mutedText leading-relaxed">
              Our automated system ingests your PDF, parses the textual stream, runs intelligent pattern matching, and renders structured fields instantly.
            </p>
          </div>

          {/* Timeline Cards Container */}
          <div className="grid md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-card border border-customBorder p-8 rounded-3xl flex flex-col items-start relative hover:border-accent/30 transition-all duration-300 group">
              <div className="absolute top-6 right-6 font-display font-bold text-2xl text-accent/10 group-hover:text-accent/20 transition-colors">
                01
              </div>
              <div className="w-12 h-12 rounded-xl bg-background border border-customBorder flex items-center justify-center mb-6">
                <Upload className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-white">
                Upload Resume
              </h3>
              <p className="text-xs sm:text-sm text-mutedText leading-relaxed">
                Drag and drop your PDF resume directly into the uploader card.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card border border-customBorder p-8 rounded-3xl flex flex-col items-start relative hover:border-accent/30 transition-all duration-300 group">
              <div className="absolute top-6 right-6 font-display font-bold text-2xl text-accent/10 group-hover:text-accent/20 transition-colors">
                02
              </div>
              <div className="w-12 h-12 rounded-xl bg-background border border-customBorder flex items-center justify-center mb-6">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-white">
                Extract Text
              </h3>
              <p className="text-xs sm:text-sm text-mutedText leading-relaxed">
                The parser extracts raw text strings, preserving content sequences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card border border-customBorder p-8 rounded-3xl flex flex-col items-start relative hover:border-accent/30 transition-all duration-300 group">
              <div className="absolute top-6 right-6 font-display font-bold text-2xl text-accent/10 group-hover:text-accent/20 transition-colors">
                03
              </div>
              <div className="w-12 h-12 rounded-xl bg-background border border-customBorder flex items-center justify-center mb-6">
                <Cpu className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-white">
                AI Parsing
              </h3>
              <p className="text-xs sm:text-sm text-mutedText leading-relaxed">
                AI identifies structure, entities, timelines, and technical skill categorizations.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-card border border-customBorder p-8 rounded-3xl flex flex-col items-start relative hover:border-accent/30 transition-all duration-300 group">
              <div className="absolute top-6 right-6 font-display font-bold text-2xl text-accent/10 group-hover:text-accent/20 transition-colors">
                04
              </div>
              <div className="w-12 h-12 rounded-xl bg-background border border-customBorder flex items-center justify-center mb-6">
                <Layout className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-white">
                Results Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-mutedText leading-relaxed">
                Review, filter, copy, and export structured data formats instantly.
              </p>
            </div>

          </div>

          {/* Workflow Pipeline Process Diagram */}
          <div className="mt-20 border border-customBorder bg-card rounded-3xl p-8 max-w-4xl mx-auto">
            <h4 className="font-display font-bold text-base mb-6 text-center text-white/95 uppercase tracking-wider">
              Data Pipeline Process Diagram
            </h4>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
              
              <div className="flex items-center gap-3 bg-background border border-customBorder px-5 py-3.5 rounded-2xl w-full md:w-auto">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-4.5 h-4.5 text-accent" />
                </div>
                <div>
                  <div className="text-[10px] text-mutedText font-semibold uppercase tracking-wider">Source</div>
                  <div className="text-sm font-bold text-white">Resume PDF</div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-accent rotate-90 md:rotate-0" />

              <div className="flex items-center gap-3 bg-background border border-customBorder px-5 py-3.5 rounded-2xl w-full md:w-auto">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Terminal className="w-4.5 h-4.5 text-accent" />
                </div>
                <div>
                  <div className="text-[10px] text-mutedText font-semibold uppercase tracking-wider">Parser Engine</div>
                  <div className="text-sm font-bold text-white">Python Parser</div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-accent rotate-90 md:rotate-0" />

              <div className="flex items-center gap-3 bg-background border border-customBorder px-5 py-3.5 rounded-2xl w-full md:w-auto">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Cpu className="w-4.5 h-4.5 text-accent" />
                </div>
                <div>
                  <div className="text-[10px] text-mutedText font-semibold uppercase tracking-wider">Extraction</div>
                  <div className="text-sm font-bold text-white">Regex + AI</div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-accent rotate-90 md:rotate-0" />

              <div className="flex items-center gap-3 bg-background border border-customBorder px-5 py-3.5 rounded-2xl w-full md:w-auto">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Database className="w-4.5 h-4.5 text-accent" />
                </div>
                <div>
                  <div className="text-[10px] text-mutedText font-semibold uppercase tracking-wider">Payload</div>
                  <div className="text-sm font-bold text-white">Structured Data</div>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-accent rotate-90 md:rotate-0" />

              <div className="flex items-center gap-3 bg-accent border border-accent/20 px-5 py-3.5 rounded-2xl w-full md:w-auto">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Layout className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-white/80 font-semibold uppercase tracking-wider">Interface</div>
                  <div className="text-sm font-bold text-white">Beautiful Dashboard</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Parser Execution & Output Preview Section */}
      <section ref={previewSectionRef} id="preview" className="max-w-7xl mx-auto px-6 py-24">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              Resume Analysis Engine
            </h2>
            <p className="text-sm sm:text-base text-mutedText max-w-xl leading-relaxed">
              Explore parsing capabilities interactively. Upload your own resume above, or inspect this live structural extraction dashboard below.
            </p>
          </div>
          
          <div className="flex items-center gap-3.5 self-start">
            <button 
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-2 text-xs font-semibold px-4.5 py-2.5 rounded-xl border transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-accent border-accent text-white'
                  : 'bg-card border-customBorder text-mutedText hover:border-white/20 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Dashboard View
            </button>
            <button 
              onClick={() => setViewMode('json')}
              className={`flex items-center gap-2 text-xs font-semibold px-4.5 py-2.5 rounded-xl border transition-all ${
                viewMode === 'json'
                  ? 'bg-accent border-accent text-white'
                  : 'bg-card border-customBorder text-mutedText hover:border-white/20 hover:text-white'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              Raw JSON Payload
            </button>
          </div>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Original PDF Resume Preview (White Paper Sheet Style) */}
          <div className="lg:col-span-5 bg-card border border-customBorder p-6 rounded-3xl shadow-premium relative">
            <div className="flex items-center justify-between border-b border-customBorder pb-4 mb-5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Original Document</span>
              </div>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-white font-semibold uppercase">
                {file ? file.name.substring(0, 20) + (file.name.length > 20 ? "..." : "") : "Default_CV.pdf"}
              </span>
            </div>

            {/* Document body simulating a PDF */}
            <div className="relative min-h-[580px] bg-white text-slate-800 rounded-2xl p-8 overflow-hidden select-none flex flex-col font-sans">
              
              {/* If parsing is running, show overlay */}
              {isParsing && (
                <div className="absolute inset-0 bg-[#202322]/95 text-white flex flex-col items-center justify-center p-8 z-10 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full border-4 border-customBorder border-t-accent animate-spin mb-6" />
                  <h4 className="font-display font-bold text-lg mb-2">Analyzing Resume Document</h4>
                  
                  <div className="flex flex-col items-center gap-2 text-xs text-mutedText">
                    <span className={parsingStep >= 1 ? "text-accent font-semibold" : ""}>
                      {parsingStep >= 1 ? "✓" : "○"} Step 1: Extracting raw text streams
                    </span>
                    <span className={parsingStep >= 2 ? "text-accent font-semibold" : ""}>
                      {parsingStep >= 2 ? "✓" : "○"} Step 2: Querying Google Gemini AI schema
                    </span>
                    <span>
                      ○ Step 3: Preparing structured dashboard payload
                    </span>
                  </div>
                </div>
              )}

              {/* PDF Content Mockup */}
              <div className="border-b-[1.5px] border-slate-200 pb-4 mb-4 text-center">
                <h3 className="font-sans font-bold text-xl text-slate-900 tracking-tight leading-tight">
                  {currentProfile.name}
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-center gap-3">
                  <span>{currentProfile.email}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span>{currentProfile.phone}</span>
                </p>
              </div>

              {/* Summary Block */}
              <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5 uppercase tracking-wider">
                  Summary
                </h4>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  {currentProfile.summary}
                </p>
              </div>

              {/* Experience Block */}
              <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5 uppercase tracking-wider">
                  Professional Experience
                </h4>
                
                {currentProfile.experience.map((exp, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="flex items-baseline justify-between text-[10px] font-semibold text-slate-800">
                      <span>{exp.role} — {exp.company}</span>
                      <span className="text-slate-500 text-[9px]">{exp.duration}</span>
                    </div>
                    <p className="text-[9px] text-slate-600 mt-0.5 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Skills Block */}
              <div className="mb-4">
                <h4 className="text-[10px] font-bold text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5 uppercase tracking-wider">
                  Technical Expertise
                </h4>
                <p className="text-[9px] text-slate-600 leading-relaxed">
                  {currentProfile.skills.join(", ")}
                </p>
              </div>

              {/* Education Block */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5 uppercase tracking-wider">
                  Education & Qualifications
                </h4>
                
                {currentProfile.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between text-[9px] text-slate-600 mb-1 last:mb-0">
                    <span><strong className="text-slate-700">{edu.degree}</strong>, {edu.institution}</span>
                    <span>{edu.year}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* RIGHT: Parsed Data Card (Dashboard style or JSON) */}
          <div className="lg:col-span-7 flex flex-col">
            
            <AnimatePresence mode="wait">
              {viewMode === 'dashboard' ? (
                
                // Visual Dashboard View
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card border border-customBorder rounded-3xl p-6 md:p-8 min-h-[640px] flex flex-col"
                >
                  {/* Top Candidate Summary */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-customBorder pb-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center font-display font-bold text-accent text-2xl">
                        {currentProfile.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold text-white leading-tight">
                          {currentProfile.name}
                        </h3>
                        <p className="text-xs text-mutedText mt-0.5">Parsed Entity Profile</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs text-mutedText">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-accent" />
                        <span>{currentProfile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-accent" />
                        <span>{currentProfile.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                      <Sparkles className="w-4 h-4 text-accent" />
                      Executive Summary
                    </div>
                    <div className="bg-background border border-customBorder p-4.5 rounded-2xl text-sm leading-relaxed text-mutedText">
                      {currentProfile.summary}
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-3">
                      <Code className="w-4 h-4 text-accent" />
                      Extracted Competencies
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-customBorder bg-background text-white hover:border-accent hover:text-accent transition-colors duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dual Grid: Work Exp & Education/Projects */}
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Experience column */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-4">
                        <Briefcase className="w-4 h-4 text-accent" />
                        Professional Timeline
                      </div>
                      <div className="space-y-4">
                        {currentProfile.experience.map((exp, idx) => (
                          <div key={idx} className="bg-background border border-customBorder p-4 rounded-2xl">
                            <div className="text-xs font-bold text-white">{exp.role}</div>
                            <div className="text-[10px] text-accent font-semibold mt-0.5">{exp.company}</div>
                            <div className="text-[10px] text-mutedText mt-1.5">{exp.duration}</div>
                            <p className="text-xs text-mutedText mt-2 leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right column: Education & Projects */}
                    <div className="space-y-6">
                      
                      {/* Education block */}
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-4">
                          <GraduationCap className="w-4 h-4 text-accent" />
                          Academic History
                        </div>
                        <div className="space-y-3">
                          {currentProfile.education.map((edu, idx) => (
                            <div key={idx} className="bg-background border border-customBorder p-4 rounded-2xl">
                              <div className="text-xs font-bold text-white">{edu.degree}</div>
                              <div className="text-[10px] text-mutedText mt-1">{edu.institution}</div>
                              <div className="text-[10px] text-accent font-semibold mt-1.5">{edu.year}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Projects block */}
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-4">
                          <FolderGit className="w-4 h-4 text-accent" />
                          Key Projects
                        </div>
                        <div className="space-y-3">
                          {currentProfile.projects.map((proj, idx) => (
                            <div key={idx} className="bg-background border border-customBorder p-4 rounded-2xl">
                              <div className="text-xs font-bold text-white">{proj.title}</div>
                              <div className="text-[10px] text-accent font-semibold mt-0.5">{proj.techStack}</div>
                              <p className="text-xs text-mutedText mt-2 leading-relaxed">
                                {proj.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </motion.div>
              ) : (
                
                // Raw JSON Payload View
                <motion.div 
                  key="json"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card border border-customBorder rounded-3xl p-6 min-h-[640px] flex flex-col font-mono"
                >
                  <div className="flex items-center justify-between border-b border-customBorder pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4.5 h-4.5 text-accent" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white">JSON Response Stream</span>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(currentProfile, null, 2));
                        showNotification("JSON copied to clipboard.");
                      }}
                      className="text-[10px] bg-background hover:bg-white/5 px-3 py-1.5 rounded-lg border border-customBorder text-white font-semibold uppercase tracking-wider transition-all"
                    >
                      Copy Payload
                    </button>
                  </div>

                  <div className="flex-1 bg-background border border-customBorder p-5 rounded-2xl text-xs overflow-y-auto no-scrollbar max-h-[520px] text-mutedText leading-relaxed">
                    <pre className="whitespace-pre-wrap word-break">
                      {JSON.stringify(currentProfile, null, 2)}
                    </pre>
                  </div>
                </motion.div>

              )}
            </AnimatePresence>

          </div>

        </div>

      </section>

      {/* Features Grid Section */}
      <section id="features" className="border-t border-customBorder bg-[#232625] py-24">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              Features Section
            </h2>
            <p className="text-sm sm:text-base text-mutedText leading-relaxed">
              Explore our resume intelligence capabilities. Designed from the ground up to parse complex layouts at scale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-card border border-customBorder p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 flex items-start gap-4 shadow-soft"
                >
                  <div className="w-10 h-10 rounded-xl bg-background border border-customBorder flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base mb-1.5 text-white">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-mutedText leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-mutedText max-w-md mx-auto leading-relaxed">
            Everything you need to know about the AI parser mechanics and privacy policy.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-card border border-customBorder rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-white">
                    {faq.q}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-background border border-customBorder flex items-center justify-center shrink-0 text-accent">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-mutedText border-t border-customBorder/50 leading-relaxed bg-[#242726]/40">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-card border border-customBorder rounded-3xl p-12 text-center relative overflow-hidden flex flex-col items-center">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px]" />

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 max-w-xl text-white">
            Ready to Parse Your Resume?
          </h2>
          <p className="text-sm sm:text-base text-mutedText mb-8 max-w-md leading-relaxed">
            Get structured candidate credentials instantly. No signup required for test processing.
          </p>

          <button 
            onClick={triggerUploadClick}
            className="bg-accent hover:bg-accent/90 text-white text-base font-semibold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] soft-shadow"
          >
            Upload Resume
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-customBorder bg-[#1d1f1e] py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-white text-sm">
                R
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                AI Resume Parser
              </span>
            </div>
            
            <p className="text-xs text-mutedText max-w-sm leading-relaxed">
              Premium client-side parser dashboard powered by Google Gemini. Instantly structures PDF resumes into developer-friendly schemas.
            </p>
          </div>

          <div className="md:col-span-6 md:text-right space-y-4">
            <div className="text-xs font-semibold text-white/90 uppercase tracking-wider">
              Built Using
            </div>
            
            <div className="flex flex-wrap md:justify-end gap-2 text-[10px] text-mutedText font-semibold font-mono">
              <span className="bg-card border border-customBorder px-2.5 py-1 rounded-md">React</span>
              <span className="bg-card border border-customBorder px-2.5 py-1 rounded-md">Node.js</span>
              <span className="bg-card border border-customBorder px-2.5 py-1 rounded-md">Express</span>
              <span className="bg-card border border-customBorder px-2.5 py-1 rounded-md">Python</span>
              <span className="bg-card border border-customBorder px-2.5 py-1 rounded-md">PyMuPDF</span>
              <span className="bg-card border border-customBorder px-2.5 py-1 rounded-md">Gemini API</span>
            </div>

            <div className="flex items-center md:justify-end gap-4 text-mutedText pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <span className="text-xs text-mutedText/60">
                &copy; {new Date().getFullYear()} AI Resume Parser. All rights reserved.
              </span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
