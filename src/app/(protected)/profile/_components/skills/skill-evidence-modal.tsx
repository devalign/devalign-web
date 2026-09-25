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

/**
 * Computes the ICT (Índice de Competencia Técnica) score based on weighted evidence.
 * - Experiencia Profesional: Max 5.0 pts (logarithmic scale)
 * - Código y Proyectos: Max 3.0 pts
 * - Formación y Certificaciones: Max 2.0 pts (Cursos +1.0, Certificación +2.0, cap 2.0)
 * Total Max: 10.0 pts.
 */
export function computeIctScore(
  yearsExp: number,
  personalProjects: boolean,
  selfTaught: boolean,
  hasCertification: boolean,
): number {
  let expPoints = 0;
  if (yearsExp >= 5) expPoints = 5.0;
  else if (yearsExp === 4) expPoints = 4.7;
  else if (yearsExp === 3) expPoints = 4.2;
  else if (yearsExp === 2) expPoints = 3.5;
  else if (yearsExp === 1) expPoints = 2.5;

  const projectsPoints = personalProjects ? 3.0 : 0.0;
  const trainingPoints = Math.min(
    2.0,
    (selfTaught ? 1.0 : 0.0) + (hasCertification ? 2.0 : 0.0),
  );

  return Number(Math.min(10.0, expPoints + projectsPoints + trainingPoints).toFixed(1));
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
  const computedScore = computeIctScore(
    yearsExperience,
    personalProjects,
    selfTaught,
    hasCertification,
  );

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
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg font-black flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <span>Evidencia de Competencia</span>
          </DialogTitle>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-xs tracking-wide border border-primary/20">
              {skill.name}
            </span>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-0.5">
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
              computedScore,
            )} flex flex-col items-center justify-center font-black shadow-sm`}
          >
            <span className="text-lg leading-none">{computedScore.toFixed(1)}</span>
            <span className="text-[9px] opacity-75">/ 10.0</span>
          </div>
        </div>

        <div className="space-y-3.5 py-1">
          {/* Experiencia Profesional (Máx 5.0 pts) */}
          <div className="rounded-xl border border-border p-3 space-y-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-foreground">
                    Experiencia Profesional
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Uso profesional en empleos formales (escala ponderada, máx 5.0 pts)
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

          {/* Código y Proyectos (Máx 3.0 pts) */}
          <div className="flex items-start justify-between rounded-xl border border-border p-3 hover:bg-muted/30 transition-colors">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Code2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="personal-projects" className="text-xs font-bold text-foreground cursor-pointer">
                  Código y Proyectos
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Proyectos propios, aplicaciones en producción o aportes Open Source (+3.0 pts)
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

          {/* Formación y Certificaciones (Máx 2.0 pts) */}
          <div className="rounded-xl border border-border p-3 space-y-2.5 hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between pb-1 border-b border-border/40">
              <span className="text-xs font-bold text-foreground">
                Formación y Certificaciones
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                Máx 2.0 pts
              </span>
            </div>

            {/* Cursos especializados */}
            <div className="flex items-start justify-between pt-1">
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="courses-training" className="text-xs font-semibold text-foreground cursor-pointer">
                    Cursos y Formación Especializada
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Plataformas online, bootcamps o tracks formativos (+1.0 pt)
                  </p>
                </div>
              </div>
              <Checkbox
                id="courses-training"
                checked={selfTaught}
                onCheckedChange={(checked: any) => setSelfTaught(!!checked)}
                className="h-5 w-5 rounded-md"
              />
            </div>

            {/* Certificación Oficial */}
            <div className="flex items-start justify-between pt-1.5 border-t border-border/30">
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Award className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="certifications" className="text-xs font-semibold text-foreground cursor-pointer">
                    Certificación Oficial
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Credencial oficial de la industria (AWS, Scrum, Oracle, etc.) (+2.0 pts)
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
        </div>

        <DialogFooter className="mt-3 gap-2 sm:gap-0">
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
