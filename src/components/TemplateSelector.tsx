import React from 'react';
import { TemplateType } from '../types';
import { cn } from '../lib/utils';
import { Layout, Type, AlignLeft, Briefcase, Palette } from 'lucide-react';
import { motion } from 'motion/react';

interface TemplateSelectorProps {
  current: TemplateType;
  onSelect: (template: TemplateType) => void;
}

const templates: { id: TemplateType; label: string; icon: any; description: string }[] = [
  { 
    id: 'modern', 
    label: 'Modern', 
    icon: Layout, 
    description: 'Editorial style with bold accents' 
  },
  { 
    id: 'classic', 
    label: 'Classic', 
    icon: Type, 
    description: 'Traditional serif for formal roles' 
  },
  { 
    id: 'minimal', 
    label: 'Minimal', 
    icon: AlignLeft, 
    description: 'Clean sans-serif for tech & design' 
  },
  { 
    id: 'executive', 
    label: 'Executive', 
    icon: Briefcase, 
    description: 'High-impact layout for leadership' 
  },
  { 
    id: 'creative', 
    label: 'Creative', 
    icon: Palette, 
    description: 'Bold colors and unique structure' 
  },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ current, onSelect }) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {templates.map((template) => (
        <motion.button
          key={template.id}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(template.id)}
          className={cn(
            "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group",
            current === template.id
              ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
              : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:shadow-md"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
            current === template.id ? "bg-white/10" : "bg-slate-50 group-hover:bg-slate-100"
          )}>
            <template.icon className={cn(
              "w-5 h-5",
              current === template.id ? "text-white" : "text-slate-400 group-hover:text-slate-900"
            )} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold tracking-tight">{template.label}</span>
            <span className={cn(
              "text-[10px] uppercase tracking-wider font-medium opacity-60",
              current === template.id ? "text-slate-300" : "text-slate-400"
            )}>
              {template.description}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
