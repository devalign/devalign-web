'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, GraduationCap, Award, Edit3, Plus, X, Star } from 'lucide-react';
import { useUpdateUserProfile } from '@/hooks/use-user-profile';
import { toast } from 'sonner';
import { WorkExperienceItem, EducationItem, CertificationItem } from '@/lib/api/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type ExperienceCardItem = Partial<WorkExperienceItem & EducationItem & CertificationItem>;

interface ExperienceCardProps {
  type: 'experience' | 'education' | 'certifications';
  items: ExperienceCardItem[];
  isPlaceholder?: boolean;
}

export default function ExperienceCard({ type, items, isPlaceholder = false }: ExperienceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedItems, setEditedItems] = useState<ExperienceCardItem[]>([]);
  const updateProfileMutation = useUpdateUserProfile();

  const getHeaders = () => {
    switch (type) {
      case 'experience':
        return {
          title: 'Experiencia Laboral',
          icon: <Briefcase className="h-4.5 w-4.5 text-primary" />,
          desc: 'Historial de tus puestos de trabajo y logros más relevantes.',
        };
      case 'education':
        return {
          title: 'Educación',
          icon: <GraduationCap className="h-4.5 w-4.5 text-primary" />,
          desc: 'Títulos universitarios, cursos o formación académica relevante.',
        };
      case 'certifications':
        return {
          title: 'Certificaciones',
          icon: <Award className="h-4.5 w-4.5 text-primary" />,
          desc: 'Certificaciones técnicas de proveedores de nube u organizaciones educativas.',
        };
    }
  };

  const headers = getHeaders();

  const handleOpenModal = () => {
    setEditedItems(items.map((item) => ({ ...item })));
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    const defaultItem =
      type === 'experience'
        ? { company: '', role: '', description: '', start_date: '', end_date: '', current: false }
        : type === 'education'
          ? { institution: '', degree: '', start_date: '', end_date: '' }
          : { name: '', issuer: '', date: '' };

    setEditedItems([...editedItems, defaultItem]);
  };

  const handleRemoveItem = (index: number) => {
    setEditedItems(editedItems.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    field: keyof ExperienceCardItem,
    value: string | boolean | null,
  ) => {
    const updated = [...editedItems];
    updated[index] = { ...updated[index], [field]: value };
    setEditedItems(updated);
  };

  const handleSave = async () => {
    // Basic validation
    for (const item of editedItems) {
      if (type === 'experience' && (!item.company || !item.role)) {
        toast.error('Por favor completa la empresa y el cargo.');
        return;
      }
      if (type === 'education' && (!item.institution || !item.degree)) {
        toast.error('Por favor completa la institución y el título.');
        return;
      }
      if (type === 'certifications' && !item.name) {
        toast.error('Por favor completa el nombre de la certificación.');
        return;
      }
    }

    try {
      const payloadKey =
        type === 'experience'
          ? 'work_experience'
          : type === 'education'
            ? 'education'
            : 'certifications';

      await updateProfileMutation.mutateAsync({
        [payloadKey]: editedItems,
      });

      toast.success('Información actualizada correctamente.');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar los cambios.');
    }
  };

  return (
    <Card className="border-border bg-card flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-muted-foreground flex items-center gap-2 tracking-wider uppercase">
            {headers.icon}
            {headers.title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenModal}
            disabled={isPlaceholder}
            className="h-8 gap-1.5 text-xs text-foreground border-border hover:bg-muted cursor-pointer"
          >
            <Edit3 className="h-3 w-3" />
            Editar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPlaceholder ? (
            <div className="space-y-3">
              {type === 'experience' && (
                <div className="relative pl-5 border-l-2 border-primary/10 space-y-1.5 opacity-40 select-none">
                  <div className="absolute -left-[6px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary/45" />
                  <h5 className="text-xs font-bold text-foreground">Rol Profesional</h5>
                  <p className="text-[10px] text-muted-foreground font-mono">Año Inicio — Año Fin</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tus funciones y logros se auto-completarán al cargar el archivo de tu currículum.
                  </p>
                </div>
              )}
              {type === 'education' && (
                <div className="space-y-1 opacity-40 select-none">
                  <h5 className="text-xs font-bold text-foreground">Título o Carrera</h5>
                  <p className="text-xs text-muted-foreground font-medium">Universidad o Centro de Estudios</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Año Inicio — Fin</p>
                </div>
              )}
              {type === 'certifications' && (
                <div className="flex items-start gap-2.5 opacity-40 select-none">
                  <Star className="h-4 w-4 text-amber-500/65 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-foreground">Certificación Obtenida</h5>
                    <p className="text-[10px] text-muted-foreground">Emisor de Certificación • Año</p>
                  </div>
                </div>
              )}
            </div>
          ) : items.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2 italic">
              No se han cargado datos aún.
            </p>
          ) : (
            <div className="space-y-4">
              {type === 'experience' &&
                items.map((item, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-primary/20 space-y-1">
                    <div className="absolute -left-[6px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    <h5 className="text-xs font-bold text-foreground">
                      {item.role} <span className="text-primary font-normal">@ {item.company}</span>
                    </h5>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {item.start_date} &mdash; {item.current ? 'Presente' : item.end_date || 'N/A'}
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}

              {type === 'education' &&
                items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <h5 className="text-xs font-bold text-foreground">{item.degree}</h5>
                    <p className="text-xs text-muted-foreground font-medium">{item.institution}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {item.start_date} &mdash; {item.end_date || 'N/A'}
                    </p>
                  </div>
                ))}

              {type === 'certifications' &&
                items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500/20 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-foreground">{item.name}</h5>
                      <p className="text-[10px] text-muted-foreground">
                        {item.issuer && <span>{item.issuer}</span>}
                        {item.date && <span> &bull; {item.date}</span>}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </div>

      {/* Modal / Dialog for editing */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl border-border bg-card max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              {headers.icon}
              Gestionar {headers.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {headers.desc}
            </DialogDescription>
          </DialogHeader>

          {/* Form items list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
            {editedItems.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-border bg-secondary/10 relative space-y-4"
              >
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                {type === 'experience' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Empresa</Label>
                      <Input
                        value={item.company || ''}
                        onChange={(e) => handleFieldChange(index, 'company', e.target.value)}
                        placeholder="Ej. TechFlow"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Cargo</Label>
                      <Input
                        value={item.role || ''}
                        onChange={(e) => handleFieldChange(index, 'role', e.target.value)}
                        placeholder="Ej. Senior Backend Developer"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Año Inicio</Label>
                      <Input
                        value={item.start_date || ''}
                        onChange={(e) => handleFieldChange(index, 'start_date', e.target.value)}
                        placeholder="Ej. 2022"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Año Fin</Label>
                      <Input
                        value={item.end_date || ''}
                        onChange={(e) => handleFieldChange(index, 'end_date', e.target.value)}
                        placeholder="Ej. 2025"
                        disabled={item.current}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={item.current || false}
                        onChange={(e) => handleFieldChange(index, 'current', e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary cursor-pointer h-4 w-4"
                      />
                      <Label
                        htmlFor={`current-${index}`}
                        className="text-xs font-semibold text-foreground cursor-pointer select-none"
                      >
                        Trabajo actualmente aquí
                      </Label>
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">
                        Descripción / Logros
                      </Label>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                        placeholder="Ej. Liderazgo del equipo core, migración de servicios a microservicios en Kubernetes..."
                        className="w-full rounded-md border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[70px] resize-y"
                      />
                    </div>
                  </div>
                )}

                {type === 'education' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">
                        Institución Académica
                      </Label>
                      <Input
                        value={item.institution || ''}
                        onChange={(e) => handleFieldChange(index, 'institution', e.target.value)}
                        placeholder="Ej. Universidad Tecnológica Nacional"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">
                        Título / Especialización
                      </Label>
                      <Input
                        value={item.degree || ''}
                        onChange={(e) => handleFieldChange(index, 'degree', e.target.value)}
                        placeholder="Ej. Ingeniería en Sistemas de Información"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Año Inicio</Label>
                      <Input
                        value={item.start_date || ''}
                        onChange={(e) => handleFieldChange(index, 'start_date', e.target.value)}
                        placeholder="Ej. 2012"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Año Fin</Label>
                      <Input
                        value={item.end_date || ''}
                        onChange={(e) => handleFieldChange(index, 'end_date', e.target.value)}
                        placeholder="Ej. 2017"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                )}

                {type === 'certifications' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">
                        Nombre de la Certificación
                      </Label>
                      <Input
                        value={item.name || ''}
                        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                        placeholder="Ej. AWS Certified Solutions Architect"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Emisor</Label>
                      <Input
                        value={item.issuer || ''}
                        onChange={(e) => handleFieldChange(index, 'issuer', e.target.value)}
                        placeholder="Ej. Amazon Web Services (AWS)"
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">Fecha / Año</Label>
                      <Input
                        value={item.date || ''}
                        onChange={(e) => handleFieldChange(index, 'date', e.target.value)}
                        placeholder="Ej. 2024"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              onClick={handleAddItem}
              className="w-full h-10 border-dashed border-primary/40 text-primary hover:bg-primary/5 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Agregar nuevo elemento
            </Button>
          </div>

          <DialogFooter className="border-t border-border pt-4 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="text-xs border-border hover:bg-muted cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="text-xs font-semibold cursor-pointer"
            >
              {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
