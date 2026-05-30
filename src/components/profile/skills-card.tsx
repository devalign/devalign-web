'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkillItem } from '@/lib/api/types';
import { useUpdateUserSkills } from '@/hooks/use-user-profile';
import { Sparkles, Edit3, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface SkillsCardProps {
  detectedSkills: SkillItem[];
  skillGaps: SkillItem[];
}

export default function SkillsCard({ detectedSkills, skillGaps }: SkillsCardProps) {
  const [activeTab, setActiveTab] = useState<'tecnicas' | 'blandas' | 'herramientas'>('tecnicas');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSkillsList, setEditSkillsList] = useState<SkillItem[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'tecnicas' | 'blandas' | 'herramientas'>(
    'tecnicas',
  );

  const updateSkillsMutation = useUpdateUserSkills();

  // Combine skills for editing, with a temporary 'market_importance' property mapping status
  const allSkills = [
    ...detectedSkills.map((s) => ({ ...s, market_importance: 'consolidated' })),
    ...skillGaps.map((g) => ({ ...g, market_importance: g.market_importance || 'gap' })),
  ];

  // Helper to categorize skills
  const getSkillCategory = (
    name: string,
    type: string,
  ): 'tecnicas' | 'blandas' | 'herramientas' => {
    const nameLower = name.toLowerCase();
    if (type === 'soft_skill' || nameLower === 'soft_skill') return 'blandas';
    if (type === 'tool' || type === 'methodology' || nameLower === 'tool') return 'herramientas';

    // Simple heuristical filters for safety
    const tools = [
      'aws',
      'azure',
      'google cloud',
      'gcp',
      'docker',
      'kubernetes',
      'terraform',
      'git',
      'github',
      'linux',
      'prometheus',
      'grafana',
      'airflow',
      'snowflake',
      'ci/cd',
      'github actions',
      'kubernetes',
      'helm',
      'docker',
    ];
    const soft = [
      'liderazgo',
      'comunicación',
      'trabajo en equipo',
      'mentoría',
      'adaptabilidad',
      'empatía',
      'resolución de problemas',
      'negociación',
      'agile',
      'scrum',
      'leadership',
      'communication',
      'teamwork',
    ];
    if (tools.some((t) => nameLower.includes(t))) return 'herramientas';
    if (soft.some((s) => nameLower.includes(s))) return 'blandas';
    return 'tecnicas';
  };

  // Filter skills for active tab view
  const tabSkills = allSkills.filter((s) => getSkillCategory(s.name, s.skill_type) === activeTab);

  // Generate levels and dot counts based on name length or static logic to match aesthetic
  const getSkillLevel = (name: string) => {
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const score = (sum % 3) + 3; // returns 3, 4, or 5
    if (score === 5) return { dots: 5, label: 'Avanzado' };
    if (score === 4) return { dots: 4, label: 'Intermedio' };
    return { dots: 3, label: 'Intermedio' }; // fallback
  };

  const handleOpenEdit = () => {
    setEditSkillsList(allSkills.map((s) => ({ ...s })));
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = (index: number) => {
    const updated = [...editSkillsList];
    updated[index].market_importance =
      updated[index].market_importance === 'consolidated' ? 'gap' : 'consolidated';
    setEditSkillsList(updated);
  };

  const handleRemoveSkill = (index: number) => {
    const updated = editSkillsList.filter((_, i) => i !== index);
    setEditSkillsList(updated);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      toast.error('Por favor escribe el nombre de la habilidad.');
      return;
    }
    const alreadyExists = editSkillsList.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase(),
    );
    if (alreadyExists) {
      toast.error('Esta habilidad ya está en tu perfil.');
      return;
    }

    const typeMapping = {
      tecnicas: 'hard_skill',
      blandas: 'soft_skill',
      herramientas: 'tool',
    };

    const newSkill: SkillItem = {
      name: newSkillName.trim(),
      skill_type: typeMapping[newSkillCategory],
      market_importance: 'consolidated',
    };

    setEditSkillsList([...editSkillsList, newSkill]);
    setNewSkillName('');
    toast.success(`Habilidad agregada: ${newSkill.name}`);
  };

  const handleSave = async () => {
    try {
      await updateSkillsMutation.mutateAsync(editSkillsList);
      toast.success('Habilidades actualizadas correctamente.');
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar habilidades.');
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
          <Sparkles className="h-4 w-4 text-primary" />
          Habilidades Detectadas
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenEdit}
          className="h-8 gap-1.5 text-xs text-foreground border-border hover:bg-muted cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Editar habilidades
        </Button>
      </CardHeader>
      <CardContent>
        {/* Navigation Tabs */}
        <div className="flex border-b border-border pb-px mb-4">
          {(['tecnicas', 'blandas', 'herramientas'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 text-xs font-bold transition-all border-b-2 capitalize cursor-pointer -mb-px ${
                activeTab === tab
                  ? 'border-primary text-primary font-extrabold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'tecnicas' ? 'Técnicas' : tab === 'blandas' ? 'Blandas' : 'Herramientas'}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {tabSkills.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            No se han detectado habilidades en esta pestaña.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tabSkills.map((skill) => {
              const level = getSkillLevel(skill.name);
              const isGap = skill.market_importance !== 'consolidated';

              return (
                <div
                  key={skill.name}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                    isGap
                      ? 'border-dashed border-amber-300 bg-amber-50/10 dark:border-amber-950/20'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <p
                      className="text-xs font-semibold text-foreground truncate"
                      title={skill.name}
                    >
                      {skill.name}
                    </p>
                    <p
                      className={`text-[10px] ${isGap ? 'text-amber-600 font-semibold' : 'text-muted-foreground'}`}
                    >
                      {isGap ? 'Brecha (Gap)' : level.label}
                    </p>
                  </div>

                  {!isGap && (
                    <div className="flex items-center gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div
                          key={dot}
                          className={`h-1.5 w-1.5 rounded-full ${
                            dot <= level.dots ? 'bg-primary' : 'bg-secondary'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Radical/Radix Dialog for Editing */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl border-border bg-card max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              Editar Habilidades Profesionales
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define cuáles de las habilidades extraídas ya posees (Consolidadas) y cuáles
              consideras brechas para tu crecimiento técnico.
            </DialogDescription>
          </DialogHeader>

          {/* Quick Add Form */}
          <div className="py-3 border-b border-border flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="new-skill" className="text-xs font-bold text-foreground">
                Habilidad
              </Label>
              <Input
                id="new-skill"
                placeholder="Ej. Python, Docker, Adaptabilidad"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="h-9 border-border bg-card text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-cat" className="text-xs font-bold text-foreground">
                Categoría
              </Label>
              <select
                id="new-cat"
                value={newSkillCategory}
                onChange={(e) =>
                  setNewSkillCategory(e.target.value as 'tecnicas' | 'blandas' | 'herramientas')
                }
                className="h-9 rounded-md border border-input bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="tecnicas">Técnicas</option>
                <option value="blandas">Blandas</option>
                <option value="herramientas">Herramientas</option>
              </select>
            </div>
            <Button
              size="sm"
              onClick={handleAddSkill}
              className="h-9 gap-1 text-xs font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 shrink-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </div>

          {/* Scrollable list of skills */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Habilidades en el perfil
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {editSkillsList.map((skill, index) => {
                  const isConsolidated = skill.market_importance === 'consolidated';
                  return (
                    <div
                      key={`${skill.name}-${index}`}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {skill.name}
                        </p>
                        <p className="text-[9px] text-muted-foreground capitalize">
                          {getSkillCategory(skill.name, skill.skill_type)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleStatus(index)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer ${
                            isConsolidated
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                          }`}
                        >
                          {isConsolidated ? 'Consolidada' : 'Brecha (Gap)'}
                        </button>
                        <button
                          onClick={() => handleRemoveSkill(index)}
                          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-4 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
              className="text-xs border-border hover:bg-muted cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateSkillsMutation.isPending}
              className="text-xs font-semibold cursor-pointer"
            >
              {updateSkillsMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
