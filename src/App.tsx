import React, { useState, useRef } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { ResumeData } from './types';
import { Button } from './components/ui/Button';
import { Download, FileText, Layout, Eye, Edit3, Sparkles, Wand2, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';
import { generateResume } from './services/gemini';
import { cn } from './lib/utils';

const initialData: ResumeData = {
  template: 'modern',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    objective: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
};

const SAMPLES: Record<string, ResumeData> = {
  "Software Engineer": {
    template: 'modern',
    personalInfo: {
      fullName: 'Alex Rivera',
      email: 'alex.rivera@tech.com',
      phone: '+1 (555) 012-3456',
      address: 'San Francisco, CA',
      website: 'github.com/arivera',
      objective: 'Senior Software Engineer with 10+ years of experience in full-stack development. Expert in React, Node.js, and distributed systems. Passionate about building scalable, high-performance web applications.'
    },
    experience: [
      { id: '1', company: 'Tech Giant Corp', position: 'Senior Software Engineer', startDate: '2018', endDate: 'Present', description: '• Led a team of 12 engineers to rebuild the core checkout flow, increasing conversion by 15%.\n• Optimized database queries, reducing latency by 40% across the platform.' },
      { id: '2', company: 'Startup Hub', position: 'Full Stack Developer', startDate: '2014', endDate: '2018', description: '• Developed and maintained multiple client-facing React applications.\n• Implemented CI/CD pipelines, reducing deployment time by 50%.' }
    ],
    education: [{ id: '1', school: 'Stanford University', degree: 'B.S. in Computer Science', startDate: '2010', endDate: '2014', description: 'GPA: 3.9/4.0' }],
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    projects: [{ id: '1', name: 'Open Source UI Kit', description: 'A highly accessible UI component library with 5k+ stars on GitHub.', link: 'github.com/arivera/ui-kit' }],
    certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional Engineer']
  },
  "Marketing Manager": {
    template: 'creative',
    personalInfo: {
      fullName: 'Sarah Chen',
      email: 'sarah.chen@marketing.io',
      phone: '+1 (555) 987-6543',
      address: 'New York, NY',
      website: 'sarahchen.design',
      objective: 'Creative Marketing Manager with a track record of driving brand growth through data-driven strategies and innovative campaigns. Specialized in digital storytelling and cross-functional leadership.'
    },
    experience: [
      { id: '1', company: 'Global Brands Inc', position: 'Marketing Manager', startDate: '2019', endDate: 'Present', description: '• Managed a $2M annual marketing budget, achieving 25% YoY growth in brand awareness.\n• Orchestrated a multi-channel campaign that reached 5M+ unique users.' }
    ],
    education: [{ id: '1', school: 'NYU Stern', degree: 'MBA in Marketing', startDate: '2017', endDate: '2019', description: 'Dean\'s List' }],
    skills: ['Brand Strategy', 'SEO/SEM', 'Content Marketing', 'Data Analytics', 'Adobe Creative Suite'],
    projects: [{ id: '1', name: 'Rebrand 2022', description: 'Led the complete visual and strategic rebranding for a Fortune 500 client.', link: 'behance.net/sarahchen' }],
    certifications: ['Google Ads Certified', 'HubSpot Content Marketing']
  },
  "Executive": {
    template: 'executive',
    personalInfo: {
      fullName: 'Michael Sterling',
      email: 'm.sterling@executive.com',
      phone: '+1 (555) 111-2222',
      address: 'Chicago, IL',
      website: 'linkedin.com/in/msterling',
      objective: 'Visionary Chief Operating Officer with 20 years of experience in scaling global operations. Proven ability to drive profitability, streamline processes, and lead high-performing executive teams.'
    },
    experience: [
      { id: '1', company: 'Apex Global', position: 'COO', startDate: '2015', endDate: 'Present', description: '• Oversaw global operations across 15 countries, increasing operational efficiency by 30%.\n• Led a successful $500M acquisition and integration project.' }
    ],
    education: [{ id: '1', school: 'Harvard Business School', degree: 'MBA', startDate: '2005', endDate: '2007', description: 'Focus on Global Operations' }],
    skills: ['Strategic Planning', 'Operations Management', 'M&A', 'P&L Responsibility', 'Executive Leadership'],
    projects: [],
    certifications: ['Certified Management Accountant (CMA)']
  },
  "Graphic Designer": {
    template: 'minimal',
    personalInfo: {
      fullName: 'Elena Rossi',
      email: 'elena@rossi.design',
      phone: '+1 (555) 333-4444',
      address: 'Milan, Italy',
      website: 'rossi.design',
      objective: 'Award-winning Graphic Designer with a focus on minimalist aesthetics and functional design. Expert in typography, branding, and user interface design.'
    },
    experience: [
      { id: '1', company: 'Studio Minimal', position: 'Senior Designer', startDate: '2020', endDate: 'Present', description: '• Developed visual identities for 50+ international brands.\n• Won the Red Dot Design Award 2022 for innovative packaging design.' }
    ],
    education: [{ id: '1', school: 'Politecnico di Milano', degree: 'B.A. in Visual Design', startDate: '2016', endDate: '2020', description: 'Graduated with Honors' }],
    skills: ['Typography', 'Branding', 'UI/UX', 'Figma', 'Illustrator', 'InDesign'],
    projects: [{ id: '1', name: 'Typeface "Aura"', description: 'Designed a custom geometric sans-serif typeface used by 10k+ designers.', link: 'fonts.com/aura' }],
    certifications: []
  },
  "Project Manager": {
    template: 'classic',
    personalInfo: {
      fullName: 'David Miller',
      email: 'david.miller@pmp.com',
      phone: '+1 (555) 555-6666',
      address: 'Austin, TX',
      website: 'pmp-david.com',
      objective: 'PMP-certified Project Manager with 7 years of experience in the construction and engineering sectors. Expert in risk management, stakeholder communication, and on-time delivery.'
    },
    experience: [
      { id: '1', company: 'BuildRight Engineering', position: 'Lead Project Manager', startDate: '2017', endDate: 'Present', description: '• Managed $50M+ infrastructure projects from inception to completion.\n• Reduced project overhead by 12% through improved resource allocation.' }
    ],
    education: [{ id: '1', school: 'UT Austin', degree: 'B.S. in Civil Engineering', startDate: '2012', endDate: '2016', description: 'President of Engineering Society' }],
    skills: ['Agile/Scrum', 'Risk Management', 'Stakeholder Management', 'MS Project', 'Budgeting'],
    projects: [{ id: '1', name: 'City Bridge Project', description: 'Led the $20M reconstruction of the historic city bridge ahead of schedule.', link: '' }],
    certifications: ['PMP Certified', 'Prince2 Practitioner']
  }
};

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'ai'>('edit');
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const generatedData = await generateResume(aiPrompt);
      setResumeData(generatedData);
      setActiveTab('edit');
    } catch (error) {
      console.error('AI Generation failed:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.personalInfo.fullName || 'resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh bg-dot-grid text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative overflow-hidden">
      {/* Background Design Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-blue-100/30 rounded-full blur-[120px] animate-blob [animation-delay:2s]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-100/30 rounded-full blur-[120px] animate-blob [animation-delay:4s]" />
      </div>

      {/* Top Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 py-4"
      >
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300 shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">ProResume</h1>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Workspace v2.0</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-6"
          >
            <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'edit' 
                    ? 'bg-white shadow-md text-black scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-semibold">Editor</span>
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'ai' 
                    ? 'bg-white shadow-md text-black scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">AI Magic</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'preview' 
                    ? 'bg-white shadow-md text-black scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-semibold">Preview</span>
              </button>
            </div>
            
            <Button 
              onClick={downloadPDF} 
              disabled={isGenerating}
              className="bg-black text-white hover:bg-slate-800 rounded-xl px-6 h-11 border-none shadow-lg shadow-black/10 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Exporting...' : 'Export PDF'}
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-[1600px] mx-auto px-8 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form / AI Generator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${activeTab !== 'preview' ? 'lg:col-span-5' : 'hidden lg:block lg:col-span-5'} space-y-8`}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'ai' ? (
                <motion.div
                  key="ai-generator"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="flex items-center gap-2 text-purple-600 font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      AI Resume Architect
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Describe yourself.</h2>
                    <p className="text-slate-500 text-sm">Tell us about your background, skills, and goals. We'll handle the rest.</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-purple-100/50 space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Your Professional Story</label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. I am a Senior Frontend Engineer with 8 years of experience in React and TypeScript. I have worked at Google and Meta, and I love building accessible web apps..."
                        className="w-full h-64 p-6 rounded-3xl bg-slate-50 border border-slate-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-slate-700 resize-none font-sans leading-relaxed"
                      />
                    </div>

                    <Button
                      onClick={handleAiGenerate}
                      disabled={isAiLoading || !aiPrompt.trim()}
                      className="w-full h-16 rounded-2xl bg-slate-900 text-white hover:bg-purple-600 transition-all duration-500 shadow-xl shadow-purple-100 flex items-center justify-center gap-3 group"
                    >
                      {isAiLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span className="font-bold">Generate Professional Resume</span>
                        </>
                      )}
                    </Button>

                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest text-center mb-4">
                        Or start with a sample
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {Object.keys(SAMPLES).map((name) => (
                          <button
                            key={name}
                            onClick={() => {
                              setResumeData(SAMPLES[name]);
                              setActiveTab('edit');
                            }}
                            className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-300 font-mono uppercase tracking-widest text-center mt-6">
                        Powered by Gemini 3.1 Pro
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-1 mb-2">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center gap-2 text-emerald-600 font-mono text-[10px] uppercase tracking-[0.2em] font-bold"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Editing Mode
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-3xl font-bold tracking-tight text-slate-900"
                    >
                      Craft your story.
                    </motion.h2>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-5" />
                    <div className="relative">
                      <ResumeForm data={resumeData} onChange={setResumeData} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${activeTab === 'preview' ? 'lg:col-span-7' : 'hidden lg:block lg:col-span-7'} sticky top-32`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col gap-1">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-[0.2em] font-bold"
                >
                  Visual Output
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-3xl font-bold tracking-tight text-slate-900"
                >
                  Final Result.
                </motion.h2>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">A4 Standard</span>
                </motion.div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.6, type: 'spring', damping: 15 }}
              className="relative group perspective-1000"
            >
              {/* Decorative background elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              
              <div className="relative overflow-auto max-h-[calc(100vh-220px)] rounded-2xl border border-slate-200/60 bg-white/40 backdrop-blur-sm p-6 md:p-12 shadow-2xl shadow-slate-200/50 custom-scrollbar">
                <div className="scale-[0.98] origin-top transition-transform duration-700 group-hover:scale-100">
                  <ResumePreview data={resumeData} previewRef={previewRef} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, delay: 1 }}
        className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-black/90 backdrop-blur-xl p-1.5 rounded-2xl flex gap-1 shadow-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'edit' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'ai' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'preview' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>
      </motion.div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}
