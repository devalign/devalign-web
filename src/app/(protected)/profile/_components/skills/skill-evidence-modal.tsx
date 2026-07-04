'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { SkillItem } from '@/lib/api/types';
import { Check, ShieldCheck, GraduationCap, Code2, Briefcase, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface SkillEvidenceModalProps {
  skill: SkillItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedSkill: SkillItem) => void;
}

export default function SkillEvidenceModal({
  skill,
  isOpen,
  onOpenChange,
  onSave,
}: SkillEvidenceModalProps) {
  const [selfTaught, setSelfTaught] = useState(false);
  const [personalProjects, setPersonalProjects] = useState(false);
  const [yearsExperience, setYearsExperience] = useState(0);
  const [hasCertification, setHasCertification] = useState(false);

  // Sync state with selected skill
  useEffect(() => {
    if (skill) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelfTaught(skill.self_taught ?? false);
      setPersonalProjects(skill.personal_projects ?? false);
      setYearsExperience(skill.years_of_experience ?? 0);
      setHasCertification(skill.has_certification ?? false);
    }
  }, [skill, isOpen]);

  if (!skill) return null;

  // Calculate live ICT Score
  const expPoints = 3 * yearsExperience;
  const certPoints = hasCertification ? 4 : 0;
  const projectsPoints = personalProjects ? 2 : 0;
  const selfTaughtPoints = selfTaught ? 1 : 0;
  const computedScore = Math.min(10.0, selfTaughtPoints + projectsPoints + expPoints + certPoints);

  const handleSave = () => {
    onSave({
      ...skill,
      self_taught: selfTaught,
      personal_projects: personalProjects,
      years_of_experience: yearsExperience,
      has_certification: hasCertification,
      ict_score: computedScore,
    });
    onOpenChange(false);
  };

  // Get color gradient / badge based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'from-emerald-500 to-teal-500 text-emerald-950 dark:text-emerald-50';
    if (score >= 5) return 'from-blue-500 to-indigo-500 text-blue-950 dark:text-blue-50';
    if (score >= 3) return 'from-amber-500 to-orange-500 text-amber-950 dark:text-amber-50';
    return 'from-slate-500 to-slate-600 text-slate-950 dark:text-slate-50';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-lg font-black flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Evidencia de Competencia: <span className="text-primary">{skill.name}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Especifica cómo adquiriste y validaste tu conocimiento en esta habilidad. El Índice de Competencia Técnica (ICT) se calcula automáticamente.
          </DialogDescription>
        </DialogHeader>

        {/* Real-time ICT Score Widget */}
        <div className="my-3 p-4 rounded-xl border border-primary/10 bg-primary/[0.02] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Índice de Competencia (ICT)
            </span>
            <p className="text-xs text-muted-foreground">
              Counter acumulativo ponderado (Máx 10.0)
            </p>
          </div>
          <div
            className={`h-12 w-20 rounded-xl bg-gradient-to-br ${getScoreColor(
              computedScore
            )} flex flex-col items-center justify-center font-black shadow-sm`}
          >
            <span className="text-lg leading-none">{computedScore.toFixed(1)}</span>
            <span className="text-[9px] opacity-75">/ 10.0</span>
          </div>
        </div>

        <div className="space-y-4 py-2">
          {/* Option 1: Self-Taught */}
          <div className="flex items-start justify-between rounded-xl border border-border p-3 hover:bg-muted/30 transition-colors">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-info/10 text-info flex items-center justify-center shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="self-taught" className="text-xs font-bold text-foreground cursor-pointer">
                  Cursos / Autodidacta
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Plataformas online, bootcamps o estudio personal (+1.0 pt)
                </p>
              </div>
            </div>
            <Checkbox
              id="self-taught"
              checked={selfTaught}
              onCheckedChange={(checked: any) => setSelfTaught(!!checked)}
              className="h-5 w-5 rounded-md"
            />
          </div>

          {/* Option 2: Personal Projects */}
          <div className="flex items-start justify-between rounded-xl border border-border p-3 hover:bg-muted/30 transition-colors">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
                <Code2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="personal-projects" className="text-xs font-bold text-foreground cursor-pointer">
                  Proyectos Personales / Open Source
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Repositorios propios, aplicaciones desarrolladas u aportes (+2.0 pts)
                </p>
              </div>
            </div>
            <Checkbox
              id="personal-projects"
              checked={personalProjects}
              onCheckedChange={(checked: any) => setPersonalProjects(!!checked)}
              className="h-5 w-5 rounded-md"
            />
          </div>

          {/* Option 3: Professional Experience */}
          <div className="rounded-xl border border-border p-3 space-y-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-foreground">
                    Experiencia Laboral
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Uso profesional en empleos formales (+3.0 pts por año)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pl-11">
              <Label htmlFor="years-exp" className="text-xs text-muted-foreground font-semibold shrink-0">
                Años de experiencia:
              </Label>
              <Input
                id="years-exp"
                type="number"
                min="0"
                max="20"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(Math.max(0, parseInt(e.target.value) || 0))}
                className="h-8 w-20 text-xs text-center font-bold"
              />
            </div>
          </div>

          {/* Option 4: Official Certifications */}
          <div className="flex items-start justify-between rounded-xl border border-border p-3 hover:bg-muted/30 transition-colors">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="certifications" className="text-xs font-bold text-foreground cursor-pointer">
                  Certificación Oficial
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Certificaciones de la industria (AWS, Scrum, Oracle, etc.) (+4.0 pts)
                </p>
              </div>
            </div>
            <Checkbox
              id="certifications"
              checked={hasCertification}
              onCheckedChange={(checked: any) => setHasCertification(!!checked)}
              className="h-5 w-5 rounded-md"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-9 text-xs">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="h-9 text-xs font-bold gap-2">
            <Check className="h-4 w-4" />
            Guardar Evidencias
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
