'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { SkillItem } from '@/types';
import { finalizeCVAnalysis } from '@/lib/api/user-service';
import { useCVAnalysis } from '@/contexts/cv-analysis-context';
import SkillEvidenceModal from '../../_components/skills/skill-evidence-modal';

interface StepConfirmSkillsProps {
  cvId: string;
  onComplete: () => void;
  onCancel: () => void;
}

function buildSkillItems(skills?: SkillItem[]) {
  return (skills || []).map((skill) => ({
    name: skill.name,
    skill_type: skill.skill_type || 'tech',
    market_importance: skill.market_importance ?? 'consolidated',
    market_demand_percentage: skill.market_demand_percentage ?? null,
    self_taught: skill.self_taught ?? false,
    personal_projects: skill.personal_projects ?? false,
    years_of_experience: skill.years_of_experience ?? 0,
    has_certification: skill.has_certification ?? false,
    ict_score: skill.ict_score ?? 0.0,
  }));
}

export function StepConfirmSkills({ cvId, onComplete, onCancel }: StepConfirmSkillsProps) {
  const { extractedSkills, startFinalization } = useCVAnalysis();

  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [newSkillText, setNewSkillText] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [selectedSkillForEvidence, setSelectedSkillForEvidence] = useState<SkillItem | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  // Initialize skills from extracted context data
  useEffect(() => {
    if (extractedSkills) {
      setSkills(buildSkillItems(extractedSkills));
    }
  }, [extractedSkills]);

  const handleAddSkill = (event: React.FormEvent) => {
    event.preventDefault();
    const skillName = newSkillText.trim();
    if (!skillName) return;

    const exists = skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      toast.error('Esta competencia ya está registrada.');
      return;
    }

    setSkills((current) => [
      ...current,
      {
        name: skillName,
        skill_type: 'tech',
        market_importance: 'consolidated',
        market_demand_percentage: null,
      },
    ]);
    setNewSkillText('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills((current) => current.filter((s) => s.name !== skillName));
  };

  const queryClient = useQueryClient();

  const handleAccept = async () => {
    setIsFinalizing(true);
    const toastId = toast.loading('Guardando competencias y generando diagnóstico...');

    try {
      // Send validated skills directly to finalize endpoint
      await finalizeCVAnalysis(cvId, skills);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userCVs'] });

      startFinalization(cvId);

      toast.dismiss(toastId);
      toast.success('Diagnóstico en proceso. Serás redirigido a tu perfil.');
      onComplete();
    } catch (error) {
      console.error('Error finalizing CV analysis:', error);
      toast.dismiss(toastId);
      toast.error('No se pudo completar el diagnóstico. Intenta nuevamente.');
      setIsFinalizing(false);
    }
  };

  const hasSkills = skills.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-foreground">
          Paso 3: Valida tus competencias técnicas
        </h2>
        <p className="text-xs text-muted-foreground">
          Revisa las competencias detectadas en tu CV. Puedes agregar o eliminar
          competencias, y ajustar la evidencia de cada una haciendo clic sobre ellas.
        </p>

        <form onSubmit={handleAddSkill} className="flex gap-2 sm:min-w-[320px]">
          <Input
            value={newSkillText}
            onChange={(event) => setNewSkillText(event.target.value)}
            placeholder="Ej. React, Docker, AWS..."
            className="h-9 text-xs bg-background"
          />
          <Button type="submit" variant="outline" className="h-9 gap-2 text-xs bg-background">
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </form>

        {hasSkills ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={`${skill.name}-${skill.skill_type}`}
                onClick={() => {
                  setSelectedSkillForEvidence(skill);
                  setIsEvidenceModalOpen(true);
                }}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-bold text-foreground hover:border-primary/50 cursor-pointer transition-all select-none group"
                title="Haga clic para editar evidencias e ICT score"
              >
                <span className="max-w-[180px] truncate group-hover:text-primary transition-colors">
                  {skill.name}
                </span>
                {skill.ict_score !== undefined ? (
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                    ICT {skill.ict_score.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground animate-pulse">
                    ICT --
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSkill(skill.name);
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                  aria-label={`Eliminar ${skill.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="w-full rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-xs font-semibold text-muted-foreground">
              No se detectaron competencias. Agrega al menos una para continuar.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-xs gap-2"
          disabled={isFinalizing}
        >
          <X className="h-3.5 w-3.5" />
          Cancelar
        </Button>

        <Button
          size="sm"
          onClick={handleAccept}
          disabled={!hasSkills || isFinalizing}
          className="text-xs gap-2"
        >
          {isFinalizing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          {isFinalizing ? 'Generando diagnóstico...' : 'Aceptar'}
        </Button>
      </div>

      <SkillEvidenceModal
        skill={selectedSkillForEvidence}
        isOpen={isEvidenceModalOpen}
        onOpenChange={setIsEvidenceModalOpen}
        onSave={(updatedSkill) => {
          setSkills((current) =>
            current.map((skill) =>
              skill.name.toLowerCase() === updatedSkill.name.toLowerCase() ? updatedSkill : skill,
            ),
          );
        }}
      />
    </div>
  );
}
