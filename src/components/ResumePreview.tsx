import React from 'react';
import { ResumeData } from '@/src/types';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ResumePreviewProps {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, previewRef }) => {
  const { personalInfo, education, experience, skills, projects, certifications, template } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const ModernTemplate = () => (
    <>
      {/* Decorative side accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900" />
      
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10">
        <motion.header variants={itemVariants} className="mb-12 relative">
          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-bold text-slate-900 tracking-tighter leading-[0.9] uppercase">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="h-1 w-24 bg-slate-900" />
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-y-3 gap-x-8 text-[11px] text-slate-500 font-mono uppercase tracking-widest">
            {personalInfo.email && <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-300" />{personalInfo.email}</div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-300" />{personalInfo.phone}</div>}
            {personalInfo.address && <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-300" />{personalInfo.address}</div>}
            {personalInfo.website && <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-slate-300" />{personalInfo.website}</div>}
          </div>
        </motion.header>

        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-8 space-y-12">
            {personalInfo.objective && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-4">Profile</h2>
                <p className="text-base leading-relaxed text-slate-700 font-sans font-light">{personalInfo.objective}</p>
              </motion.section>
            )}
            {experience.length > 0 && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Experience</h2>
                <div className="space-y-10">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative pl-6 border-l border-slate-100">
                      <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-slate-900" />
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{exp.position}</h3>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{exp.startDate} — {exp.endDate || 'Present'}</span>
                      </div>
                      <div className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">{exp.company}</div>
                      <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed font-sans">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
            {projects.length > 0 && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Selected Work</h2>
                <div className="grid grid-cols-1 gap-8">
                  {projects.map((project) => (
                    <div key={project.id} className="group">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{project.name}</h3>
                        {project.link && <div className="w-1 h-1 rounded-full bg-slate-200" />}
                        {project.link && <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Project Link</span>}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">{project.description}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
          <div className="col-span-4 space-y-12">
            {skills.length > 0 && skills[0] !== "" && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Expertise</h2>
                <div className="flex flex-col gap-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-slate-900 rotate-45" />
                      <span className="text-sm text-slate-700 font-sans font-medium uppercase tracking-wide">{skill}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
            {education.length > 0 && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Education</h2>
                <div className="space-y-8">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-tight leading-tight">{edu.degree}</h3>
                      <div className="text-[11px] text-slate-500 mb-2 font-mono uppercase tracking-widest">{edu.startDate} — {edu.endDate}</div>
                      <div className="text-xs text-slate-700 font-sans font-medium">{edu.school}</div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
            {certifications.length > 0 && certifications[0] !== "" && (
              <motion.section variants={itemVariants}>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Awards</h2>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="text-xs text-slate-600 font-sans leading-relaxed border-l-2 border-slate-100 pl-3">{cert}</div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
        <motion.footer variants={itemVariants} className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-300 uppercase tracking-[0.4em]">
          <span>Generated via ProResume Workspace</span>
          <span>Page 01</span>
        </motion.footer>
      </motion.div>
    </>
  );

  const ClassicTemplate = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
      <motion.header variants={itemVariants} className="text-center border-b-2 border-slate-900 pb-8">
        <h1 className="text-5xl font-bold text-slate-900 uppercase tracking-[0.2em] mb-4">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-600 uppercase tracking-wider">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </motion.header>

      <div className="space-y-10">
        {personalInfo.objective && (
          <motion.section variants={itemVariants}>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-4">Professional Profile</h2>
            <p className="text-base leading-relaxed text-slate-700 italic">{personalInfo.objective}</p>
          </motion.section>
        )}

        {experience.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6">Professional Experience</h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{exp.position}</h3>
                    <span className="text-xs font-mono text-slate-500">{exp.startDate} — {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-600 italic mb-3">{exp.company}</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {skills.length > 0 && skills[0] !== "" && (
          <motion.section variants={itemVariants}>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-4">Core Competencies</h2>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="text-sm text-slate-700 font-medium uppercase tracking-wide">• {skill}</div>
              ))}
            </div>
          </motion.section>
        )}

        {education.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.3em] border-b border-slate-200 pb-2 mb-6">Academic History</h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold text-slate-900 uppercase">{edu.degree}</h3>
                    <span className="text-xs font-mono text-slate-500">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div className="text-sm text-slate-700 italic">{edu.school}</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );

  const MinimalTemplate = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16 font-sans">
      <motion.header variants={itemVariants} className="space-y-6">
        <h1 className="text-5xl font-light text-slate-900 tracking-tight">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-col gap-1 text-sm text-slate-400 font-light">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </motion.header>

      <div className="space-y-16 max-w-2xl">
        {personalInfo.objective && (
          <motion.section variants={itemVariants} className="space-y-4">
            <p className="text-xl leading-relaxed text-slate-600 font-light">{personalInfo.objective}</p>
          </motion.section>
        )}

        {experience.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-8">
            <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Experience</h2>
            <div className="space-y-12">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="text-xs text-slate-400 font-mono tracking-widest">{exp.startDate} — {exp.endDate || 'Present'}</div>
                  <h3 className="text-xl font-medium text-slate-900">{exp.position}</h3>
                  <div className="text-sm text-slate-500">{exp.company}</div>
                  <p className="text-sm text-slate-600 font-light leading-relaxed pt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {skills.length > 0 && skills[0] !== "" && (
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Skills</h2>
            <div className="flex flex-wrap gap-x-12 gap-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="text-sm text-slate-600 font-light">{skill}</div>
              ))}
            </div>
          </motion.section>
        )}

        {education.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-8">
            <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Education</h2>
            <div className="space-y-8">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  <h3 className="text-lg font-medium text-slate-900">{edu.degree}</h3>
                  <div className="text-sm text-slate-500">{edu.school}</div>
                  <div className="text-xs text-slate-400 font-mono pt-1">{edu.startDate} — {edu.endDate}</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );

  const ExecutiveTemplate = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12 font-serif">
      <motion.header variants={itemVariants} className="bg-slate-900 -mx-16 -mt-16 p-16 text-white mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-6 text-sm text-slate-300 font-light">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
      </motion.header>

      <div className="space-y-12">
        {personalInfo.objective && (
          <motion.section variants={itemVariants}>
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-4">Executive Summary</h2>
            <p className="text-base leading-relaxed text-slate-700">{personalInfo.objective}</p>
          </motion.section>
        )}

        {experience.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-6">Professional History</h2>
            <div className="space-y-10">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-8">
                  <div className="col-span-1 text-sm font-bold text-slate-500 uppercase tracking-wider">
                    {exp.startDate} — {exp.endDate || 'Present'}
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{exp.position}</h3>
                    <div className="text-base font-bold text-slate-600 mb-3">{exp.company}</div>
                    <p className="text-sm text-slate-700 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <div className="grid grid-cols-2 gap-12">
          {skills.length > 0 && skills[0] !== "" && (
            <motion.section variants={itemVariants}>
              <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-4">Core Competencies</h2>
              <ul className="grid grid-cols-1 gap-2">
                {skills.map((skill, index) => (
                  <li key={index} className="text-sm text-slate-700 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {education.length > 0 && (
            <motion.section variants={itemVariants}>
              <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-4">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                    <div className="text-xs text-slate-600">{edu.school} | {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </motion.div>
  );

  const CreativeTemplate = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12 font-sans">
      <motion.header variants={itemVariants} className="flex justify-between items-end border-b-8 border-emerald-500 pb-8">
        <div>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">
            {personalInfo.fullName?.split(' ')[0] || 'Your'}<br />
            <span className="text-emerald-500">{personalInfo.fullName?.split(' ')[1] || 'Name'}</span>
          </h1>
        </div>
        <div className="text-right space-y-1">
          <div className="text-sm font-bold text-slate-900">{personalInfo.email}</div>
          <div className="text-sm text-slate-500">{personalInfo.phone}</div>
          <div className="text-sm text-slate-500">{personalInfo.website}</div>
        </div>
      </motion.header>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-4 space-y-12">
          {skills.length > 0 && skills[0] !== "" && (
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-black text-slate-900 mb-6 italic">Skills_</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {education.length > 0 && (
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-black text-slate-900 mb-6 italic">Edu_</h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="text-xs font-bold text-emerald-500 mb-1">{edu.endDate}</div>
                    <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                    <div className="text-xs text-slate-500">{edu.school}</div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        <div className="col-span-8 space-y-12">
          {personalInfo.objective && (
            <motion.section variants={itemVariants}>
              <p className="text-2xl font-medium text-slate-700 leading-tight tracking-tight">
                {personalInfo.objective}
              </p>
            </motion.section>
          )}

          {experience.length > 0 && (
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-black text-slate-900 mb-8 italic">Experience_</h2>
              <div className="space-y-12">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-900">{exp.position}</h3>
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        {exp.startDate} - {exp.endDate || 'Now'}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{exp.company}</div>
                    <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div 
      ref={previewRef}
      className={cn(
        "bg-white w-full max-w-[800px] mx-auto shadow-2xl min-h-[1122px] p-16 text-slate-900 relative overflow-hidden",
        (template === 'modern' || template === 'classic' || template === 'executive') && "font-serif",
        (template === 'minimal' || template === 'creative') && "font-sans"
      )}
      id="resume-preview"
    >
      {template === 'modern' && <ModernTemplate />}
      {template === 'classic' && <ClassicTemplate />}
      {template === 'minimal' && <MinimalTemplate />}
      {template === 'executive' && <ExecutiveTemplate />}
      {template === 'creative' && <CreativeTemplate />}
    </div>
  );
};
