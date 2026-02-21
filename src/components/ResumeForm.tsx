import React from 'react';
import { ResumeData } from '@/src/types';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Plus, Trash2, ChevronDown, ChevronUp, HelpCircle, User, Briefcase, GraduationCap, Code, Folder, Award, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tooltip } from './ui/Tooltip';
import { cn } from '@/src/lib/utils';
import { TemplateSelector } from './TemplateSelector';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = React.useState('personal');
  const [skillInput, setSkillInput] = React.useState('');
  const [certInput, setCertInput] = React.useState('');

  const sections = [
    { id: 'template', title: 'Template', icon: Layout },
    { id: 'personal', title: 'Personal', icon: User },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'skills', title: 'Skills', icon: Code },
    { id: 'projects', title: 'Projects', icon: Folder },
    { id: 'certifications', title: 'Awards', icon: Award },
  ];

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const addItem = (section: 'education' | 'experience' | 'projects') => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...(section === 'education' ? { school: '', degree: '', startDate: '', endDate: '', description: '' } : {}),
      ...(section === 'experience' ? { company: '', position: '', startDate: '', endDate: '', description: '' } : {}),
      ...(section === 'projects' ? { name: '', description: '', link: '' } : {}),
    };
    onChange({ ...data, [section]: [...data[section], newItem] });
  };

  const removeItem = (section: 'education' | 'experience' | 'projects', id: string) => {
    onChange({ ...data, [section]: data[section].filter((item: any) => item.id !== id) });
  };

  const updateItem = (section: 'education' | 'experience' | 'projects', id: string, field: string, value: string) => {
    onChange({
      ...data,
      [section]: data[section].map((item: any) => (item.id === id ? { ...item, [field]: value } : item)),
    });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      onChange({ ...data, skills: [...data.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  const addCertification = () => {
    if (certInput.trim()) {
      onChange({ ...data, certifications: [...data.certifications, certInput.trim()] });
      setCertInput('');
    }
  };

  const removeCertification = (index: number) => {
    onChange({ ...data, certifications: data.certifications.filter((_, i) => i !== index) });
  };

  const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 bg-slate-900 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-slate-200 rotate-3">
        <Icon className="w-7 h-7 text-white -rotate-3" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs font-mono text-slate-400 uppercase tracking-[0.2em] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );

  const FormField = ({ label, tooltip, children, className }: { label: string, tooltip: string, children: React.ReactNode, className?: string }) => (
    <div className={cn("space-y-3", className)}>
      <Tooltip content={tooltip}>
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 block">{label}</label>
      </Tooltip>
      {children}
    </div>
  );

  const SubHeader = ({ title }: { title: string }) => (
    <div className="col-span-full flex items-center gap-4 py-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 whitespace-nowrap">{title}</span>
      <div className="h-px bg-slate-100 w-full" />
    </div>
  );

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Sticky Sidebar Nav */}
      <aside className="hidden md:flex flex-col gap-2 sticky top-32 w-16 lg:w-48 shrink-0">
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group",
              activeSection === section.id 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105" 
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            )}
          >
            <section.icon className={cn("w-5 h-5 shrink-0", activeSection === section.id ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
            <span className="hidden lg:block text-sm font-bold tracking-tight">{section.title}</span>
          </motion.button>
        ))}
      </aside>

      {/* Main Form Content */}
      <div className="flex-1 space-y-12 w-full">
        {/* Template Selection */}
        <motion.section 
          id="section-template"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 transition-all duration-500"
        >
          <SectionHeader icon={Layout} title="Visual Style" subtitle="Choose a Template" />
          <TemplateSelector 
            current={data.template} 
            onSelect={(template) => onChange({ ...data, template })} 
          />
        </motion.section>

        {/* Personal Info */}
        <motion.section 
          id="section-personal"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 transition-all duration-500"
        >
          <SectionHeader icon={User} title="Personal Details" subtitle="Identity & Contact" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {/* Identity Group */}
            <SubHeader title="Identity" />
            <FormField 
              label="Full Name" 
              tooltip="Enter your full legal name as you want it to appear on the resume."
              className="col-span-full md:col-span-1"
            >
              <Input 
                value={data.personalInfo.fullName} 
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                onClear={() => updatePersonalInfo('fullName', '')}
                placeholder="Enter your full name (e.g. John Doe)"
              />
            </FormField>

            {/* Contact Group */}
            <SubHeader title="Contact Information" />
            <FormField 
              label="Email" 
              tooltip="Use a professional email address (e.g., name.surname@example.com)."
            >
              <Input 
                type="email"
                value={data.personalInfo.email} 
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                onClear={() => updatePersonalInfo('email', '')}
                placeholder="e.g. john.doe@example.com"
              />
            </FormField>
            <FormField 
              label="Phone" 
              tooltip="Include your country code for international applications."
            >
              <Input 
                value={data.personalInfo.phone} 
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                onClear={() => updatePersonalInfo('phone', '')}
                placeholder="e.g. +1 (555) 000-0000"
              />
            </FormField>
            <FormField 
              label="Website/LinkedIn" 
              tooltip="Link to your LinkedIn profile, portfolio, or personal website."
            >
              <Input 
                value={data.personalInfo.website} 
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                onClear={() => updatePersonalInfo('website', '')}
                placeholder="e.g. linkedin.com/in/johndoe"
              />
            </FormField>
            <FormField 
              label="Address" 
              tooltip="City and Country is usually sufficient. Full address is optional."
            >
              <Input 
                value={data.personalInfo.address} 
                onChange={(e) => updatePersonalInfo('address', e.target.value)}
                placeholder="e.g. New York, NY"
              />
            </FormField>

            {/* Summary Group */}
            <SubHeader title="Professional Summary" />
            <FormField 
              label="Summary" 
              tooltip="A 2-3 sentence summary of your professional background and key achievements."
              className="col-span-full"
            >
              <Textarea 
                value={data.personalInfo.objective} 
                onChange={(e) => updatePersonalInfo('objective', e.target.value)}
                placeholder="Describe your professional background, key achievements, and career goals to give employers a quick overview of your expertise..."
                className="h-40"
              />
            </FormField>
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section 
          id="section-experience"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 transition-all duration-500"
        >
          <div className="flex justify-between items-start mb-4">
            <SectionHeader icon={Briefcase} title="Work Experience" subtitle="Career Path" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addItem('experience')}
              className="rounded-2xl border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 h-12 px-6"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Entry
            </Button>
          </div>
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {data.experience.map((exp, index) => (
                <motion.div 
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  {index > 0 && <div className="h-px bg-slate-100 w-full mb-8" />}
                  <div className="p-8 bg-slate-50/40 border border-slate-100 rounded-[2rem] space-y-8 relative group hover:bg-white hover:border-slate-200 transition-all duration-300">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-6 right-6 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      onClick={() => removeItem('experience', exp.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField 
                        label="Company" 
                        tooltip="The name of the company or organization."
                      >
                        <Input 
                          placeholder="e.g. Google, Inc." 
                          value={exp.company} 
                          onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="Position" 
                        tooltip="Your official job title."
                      >
                        <Input 
                          placeholder="e.g. Senior Software Engineer" 
                          value={exp.position} 
                          onChange={(e) => updateItem('experience', exp.id, 'position', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="Start Date" 
                        tooltip="Month and Year (e.g., Jan 2020)."
                      >
                        <Input 
                          placeholder="e.g. Jan 2020" 
                          value={exp.startDate} 
                          onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="End Date" 
                        tooltip="Month and Year or 'Present'."
                      >
                        <Input 
                          placeholder="e.g. Dec 2023 or Present" 
                          value={exp.endDate} 
                          onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="Description" 
                        tooltip="Describe your key responsibilities and measurable achievements using bullet points."
                        className="col-span-full"
                      >
                        <Textarea 
                          placeholder="Describe your key responsibilities and measurable achievements..." 
                          value={exp.description} 
                          onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                          className="h-32"
                        />
                      </FormField>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {data.experience.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30"
              >
                <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 text-sm font-medium">No experience added yet. Start by adding your first role.</p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section 
          id="section-education"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 transition-all duration-500"
        >
          <div className="flex justify-between items-start mb-4">
            <SectionHeader icon={GraduationCap} title="Education" subtitle="Academic Background" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addItem('education')}
              className="rounded-2xl border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 h-12 px-6"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Entry
            </Button>
          </div>
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {data.education.map((edu, index) => (
                <motion.div 
                  key={edu.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  {index > 0 && <div className="h-px bg-slate-100 w-full mb-8" />}
                  <div className="p-8 bg-slate-50/40 border border-slate-100 rounded-[2rem] space-y-8 relative group hover:bg-white hover:border-slate-200 transition-all duration-300">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-6 right-6 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      onClick={() => removeItem('education', edu.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField 
                        label="School/University" 
                        tooltip="The name of the school, college, or university."
                      >
                        <Input 
                          placeholder="e.g. Stanford University" 
                          value={edu.school} 
                          onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="Degree" 
                        tooltip="The full name of your degree (e.g., B.S. in Computer Science)."
                      >
                        <Input 
                          placeholder="e.g. B.S. in Computer Science" 
                          value={edu.degree} 
                          onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="Start Date" 
                        tooltip="When you started your studies."
                      >
                        <Input 
                          placeholder="e.g. Sep 2016" 
                          value={edu.startDate} 
                          onChange={(e) => updateItem('education', edu.id, 'startDate', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="End Date" 
                        tooltip="When you graduated or expect to graduate."
                      >
                        <Input 
                          placeholder="e.g. Jun 2020" 
                          value={edu.endDate} 
                          onChange={(e) => updateItem('education', edu.id, 'endDate', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="Description" 
                        tooltip="Optional: Mention GPA, honors, or relevant coursework."
                        className="col-span-full"
                      >
                        <Textarea 
                          placeholder="e.g. GPA 3.9, Dean's List, Relevant Coursework: Algorithms, Data Structures..." 
                          value={edu.description} 
                          onChange={(e) => updateItem('education', edu.id, 'description', e.target.value)}
                          className="h-32"
                        />
                      </FormField>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section 
          id="section-skills"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 transition-all duration-500"
        >
          <SectionHeader icon={Code} title="Skills" subtitle="Expertise & Tools" />
          <div className="space-y-6">
            <div className="flex gap-3">
              <FormField 
                label="Add Skill" 
                tooltip="Type a skill and press Enter or click Add."
                className="flex-1"
              >
                <Input 
                  placeholder="e.g. React, TypeScript, UI Design..." 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
              </FormField>
              <Button 
                onClick={addSkill}
                className="mt-7 h-12 px-6 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <AnimatePresence mode="popLayout">
                {data.skills.filter(s => s !== "").map((skill, index) => (
                  <motion.div
                    key={`${skill}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 group hover:border-slate-400 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all duration-300"
                  >
                    <Code className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
                    <span>{skill}</span>
                    <button 
                      onClick={() => removeSkill(index)}
                      aria-label={`Remove skill: ${skill}`}
                      className="ml-1 p-0.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {data.skills.filter(s => s !== "").length === 0 && (
                <p className="text-slate-400 text-sm italic">No skills added yet.</p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section 
          id="section-projects"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 transition-all duration-500"
        >
          <div className="flex justify-between items-start mb-4">
            <SectionHeader icon={Folder} title="Projects" subtitle="Personal Work" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addItem('projects')}
              className="rounded-2xl border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 h-12 px-6"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Entry
            </Button>
          </div>
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {data.projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  {index > 0 && <div className="h-px bg-slate-100 w-full mb-8" />}
                  <div className="p-8 bg-slate-50/40 border border-slate-100 rounded-[2rem] space-y-8 relative group hover:bg-white hover:border-slate-200 transition-all duration-300">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-6 right-6 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      onClick={() => removeItem('projects', project.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                    <div className="grid grid-cols-1 gap-8">
                      <FormField 
                        label="Project Name" 
                        tooltip="The title of your project."
                      >
                        <Input 
                          placeholder="e.g. E-commerce Platform" 
                          value={project.name} 
                          onChange={(e) => updateItem('projects', project.id, 'name', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="Project Link" 
                        tooltip="Link to GitHub, live demo, or case study."
                      >
                        <Input 
                          placeholder="e.g. github.com/username/project" 
                          value={project.link} 
                          onChange={(e) => updateItem('projects', project.id, 'link', e.target.value)}
                        />
                      </FormField>
                      <FormField 
                        label="Project Description" 
                        tooltip="Briefly explain what the project does and the technologies used."
                      >
                        <Textarea 
                          placeholder="Describe the project's purpose, your role, and key technologies used..." 
                          value={project.description} 
                          onChange={(e) => updateItem('projects', project.id, 'description', e.target.value)}
                          className="h-32"
                        />
                      </FormField>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Certifications */}
        <motion.section 
          id="section-certifications"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50 transition-all duration-500"
        >
          <SectionHeader icon={Award} title="Certifications" subtitle="Achievements" />
          <div className="space-y-6">
            <div className="flex gap-3">
              <FormField 
                label="Add Award / Cert" 
                tooltip="Type a certification and press Enter or click Add."
                className="flex-1"
              >
                <Input 
                  placeholder="e.g. AWS Certified Developer, Hackathon Winner..." 
                  value={certInput} 
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCertification()}
                />
              </FormField>
              <Button 
                onClick={addCertification}
                className="mt-7 h-12 px-6 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <AnimatePresence mode="popLayout">
                {data.certifications.filter(c => c !== "").map((cert, index) => (
                  <motion.div
                    key={`${cert}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100 group hover:border-emerald-300 hover:bg-white hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{cert}</span>
                    <button 
                      onClick={() => removeCertification(index)}
                      aria-label={`Remove certification: ${cert}`}
                      className="ml-1 p-0.5 text-emerald-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {data.certifications.filter(c => c !== "").length === 0 && (
                <p className="text-slate-400 text-sm italic">No certifications added yet.</p>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
