'use client';

import React, { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserProfileData, SkillItem } from '@/lib/api/types';
import { Sparkles, Printer, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface CVAtsPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfileData;
  userEmail?: string;
}

export default function CVAtsPreviewModal({
  isOpen,
  onOpenChange,
  profile,
  userEmail,
}: CVAtsPreviewModalProps) {
  const cvPrintRef = useRef<HTMLDivElement>(null);

  // Group skills by category for ATS text presentation
  const getSkillsByType = (type: string) => {
    return profile.detected_skills
      .filter((s) => {
        const nameLower = s.name.toLowerCase();
        if (type === 'soft') {
          return (
            s.skill_type === 'soft_skill' ||
            nameLower === 'soft_skill' ||
            [
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
            ].some((x) => nameLower.includes(x))
          );
        }
        if (type === 'tool') {
          return (
            s.skill_type === 'tool' ||
            s.skill_type === 'methodology' ||
            nameLower === 'tool' ||
            [
              'aws',
              'azure',
              'gcp',
              'docker',
              'kubernetes',
              'terraform',
              'git',
              'github',
              'linux',
              'ci/cd',
            ].some((x) => nameLower.includes(x))
          );
        }
        // default to technical/hard skills
        return (
          s.skill_type !== 'soft_skill' &&
          s.skill_type !== 'tool' &&
          s.skill_type !== 'methodology' &&
          !['aws', 'docker', 'kubernetes', 'git', 'github'].some((x) => nameLower.includes(x))
        );
      })
      .map((s) => s.name);
  };

  const technicalSkills = getSkillsByType('technical');
  const toolSkills = getSkillsByType('tool');
  const softSkills = getSkillsByType('soft');

  const handleOptimizeClick = () => {
    toast.info(
      'Optimización con IA: Esta función analizará tu perfil frente a la oferta deseada usando Groq en la versión comercial.',
      {
        duration: 5000,
      },
    );
  };

  const defaultDescription = `Desarrollador técnico con experiencia en el diseño e implementación de soluciones de software. Especializado en optimización de flujos de trabajo y alineación de tecnologías a los estándares del mercado de desarrollo.`;

  const generatePrintHtml = () => {
    const expHtml =
      profile.work_experience && profile.work_experience.length > 0
        ? `
        <div class="section-title">Experiencia Laboral</div>
        ${profile.work_experience
          .map(
            (exp) => `
          <div class="item">
            <div class="item-header">
              <span>${exp.role}</span>
              <span style="font-weight: normal; color: #4b5563;">${exp.start_date} &ndash; ${exp.current ? 'Presente' : exp.end_date || ''}</span>
            </div>
            <div class="item-subheader">
              <span>${exp.company}</span>
              ${profile.location ? `<span>${profile.location}</span>` : ''}
            </div>
            ${
              exp.description
                ? `
              <ul class="item-description">
                ${exp.description
                  .split('\n')
                  .map((bullet) => {
                    const trimmed = bullet.replace(/^[-\s*•]+/, '').trim();
                    if (!trimmed) return '';
                    return `<li>${trimmed}</li>`;
                  })
                  .join('')}
              </ul>
            `
                : ''
            }
          </div>
        `,
          )
          .join('')}`
        : '';

    const eduHtml =
      profile.education && profile.education.length > 0
        ? `
        <div class="section-title">Educación</div>
        ${profile.education
          .map(
            (edu) => `
          <div class="item">
            <div class="item-header">
              <span>${edu.degree}</span>
              <span style="font-weight: normal; color: #4b5563;">${edu.start_date} &ndash; ${edu.end_date || 'Presente'}</span>
            </div>
            <div class="item-subheader">
              <span>${edu.institution}</span>
            </div>
          </div>
        `,
          )
          .join('')}`
        : '';

    const skillsHtml = `
      <div class="section-title">Habilidades</div>
      ${
        technicalSkills.length > 0
          ? `
        <div class="skills-block">
          <span class="skills-label">Habilidades Técnicas:</span> ${technicalSkills.join(', ')}
        </div>
      `
          : ''
      }
      ${
        toolSkills.length > 0
          ? `
        <div class="skills-block">
          <span class="skills-label">Herramientas y Tecnologías:</span> ${toolSkills.join(', ')}
        </div>
      `
          : ''
      }
      ${
        softSkills.length > 0
          ? `
        <div class="skills-block">
          <span class="skills-label">Habilidades Blandas:</span> ${softSkills.join(', ')}
        </div>
      `
          : ''
      }
    `;

    const certHtml =
      profile.certifications && profile.certifications.length > 0
        ? `
        <div class="section-title">Certificaciones</div>
        ${profile.certifications
          .map(
            (cert) => `
          <div class="item" style="margin-bottom: 8px;">
            <div class="item-header" style="font-size: 9.5pt;">
              <span>${cert.name} ${cert.issuer ? `<span style="font-weight: normal; color: #4b5563;"> &mdash; ${cert.issuer}</span>` : ''}</span>
              ${cert.date ? `<span style="font-weight: normal; color: #4b5563;">${cert.date}</span>` : ''}
            </div>
          </div>
        `,
          )
          .join('')}`
        : '';

    const contactParts = [];
    if (userEmail)
      contactParts.push(
        `<span style="color: #2563eb; text-decoration: underline;">${userEmail}</span>`,
      );
    if (profile.location) contactParts.push(`<span>${profile.location}</span>`);
    if (profile.preferred_modality) contactParts.push(`<span>${profile.preferred_modality}</span>`);
    if (profile.availability)
      contactParts.push(`<span>Disponibilidad: ${profile.availability}</span>`);

    return `
      <div class="text-center">
        <h1>${profile.full_name?.toUpperCase() || 'DESARROLLADOR'}</h1>
        <div class="title-role">
          ${profile.current_job_role || 'Software Engineer'}
          ${profile.primary_specialty ? ` | ${profile.primary_specialty.toUpperCase()}` : ''}
          ${profile.seniority ? ` | ${profile.seniority.toUpperCase()}` : ''}
        </div>
        <div class="contact-info">
          ${contactParts.join(' &bull; ')}
        </div>
      </div>

      <div class="section-title">Perfil Profesional</div>
      <div class="summary">${defaultDescription}</div>

      ${expHtml}
      ${eduHtml}
      ${skillsHtml}
      ${certHtml}
    `;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error(
        'No se pudo abrir la ventana de impresión. Comprueba los bloqueadores de popups.',
      );
      return;
    }

    const printContent = generatePrintHtml();

    // Generate plain, clean HTML document for absolute ATS text fidelity on print/PDF save
    printWindow.document.write(`
      <html>
        <head>
          <title>CV_${profile.full_name?.replace(/\s+/g, '_') || 'Devalign'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', Arial, sans-serif;
              color: #111827;
              line-height: 1.5;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              font-size: 9.5pt;
            }
            .text-center {
              text-align: center;
            }
            h1 {
              font-size: 18pt;
              font-weight: 700;
              margin: 0 0 4px 0;
              color: #111827;
              letter-spacing: -0.02em;
            }
            .title-role {
              font-size: 10pt;
              font-weight: 600;
              color: #2563eb;
              margin: 0 0 10px 0;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .contact-info {
              font-size: 8pt;
              color: #4b5563;
              margin-bottom: 20px;
              border-bottom: 1px solid #d1d5db;
              padding-bottom: 12px;
            }
            .section-title {
              font-size: 9.5pt;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              border-bottom: 2px solid #111827;
              padding-bottom: 2px;
              margin: 24px 0 12px 0;
              color: #111827;
            }
            .summary {
              font-size: 8.5pt;
              margin-bottom: 16px;
              text-align: justify;
              color: #374151;
            }
            .item {
              margin-bottom: 16px;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              font-weight: 600;
              font-size: 9.2pt;
              color: #111827;
              margin-bottom: 2px;
            }
            .item-subheader {
              display: flex;
              justify-content: space-between;
              font-size: 8.2pt;
              color: #4b5563;
              font-style: italic;
              margin-bottom: 6px;
            }
            .item-description {
              font-size: 8.5pt;
              color: #374151;
              margin: 0;
              padding-left: 18px;
              text-align: justify;
            }
            .item-description li {
              margin-bottom: 4px;
            }
            .skills-block {
              font-size: 8.5pt;
              margin-bottom: 8px;
              color: #374151;
            }
            .skills-label {
              font-weight: 600;
              color: #111827;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl h-[90vh] md:h-[85vh] max-h-[900px] flex flex-col md:flex-row border-border bg-card p-0 overflow-hidden gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Vista previa de tu CV ATS</DialogTitle>
          <DialogDescription>
            Visualiza tu currículum optimizado para sistemas de seguimiento de candidatos.
          </DialogDescription>
        </DialogHeader>

        {/* Left Side: Paper CV Preview Sheet */}
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-950/70 p-6 overflow-y-auto flex justify-center items-start scrollbar-thin">
          <div
            ref={cvPrintRef}
            className="bg-white text-zinc-900 p-8 shadow-lg border border-zinc-200 rounded-xs w-full max-w-[680px] min-h-[900px] font-sans leading-relaxed my-2"
          >
            {/* Header / Contact Details */}
            <div className="text-center">
              <h1 className="text-lg font-bold text-zinc-900 tracking-tight">
                {profile.full_name?.toUpperCase() || 'DESARROLLADOR'}
              </h1>
              <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mt-1">
                {profile.current_job_role || 'Software Engineer'}
                {profile.primary_specialty && ` | ${profile.primary_specialty.toUpperCase()}`}
                {profile.seniority && ` | ${profile.seniority.toUpperCase()}`}
              </div>
              <div className="text-[9px] text-zinc-500 mt-2 pb-3 border-b border-zinc-300 flex justify-center gap-4 flex-wrap">
                {userEmail && (
                  <span className="text-blue-600 underline font-medium">{userEmail}</span>
                )}
                {profile.location && (
                  <>
                    <span className="text-zinc-400 font-normal">&bull;</span>
                    <span>{profile.location}</span>
                  </>
                )}
                {profile.preferred_modality && (
                  <>
                    <span className="text-zinc-400 font-normal">&bull;</span>
                    <span>{profile.preferred_modality}</span>
                  </>
                )}
                {profile.availability && (
                  <>
                    <span className="text-zinc-400 font-normal">&bull;</span>
                    <span>Disponibilidad: {profile.availability}</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="mt-5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-zinc-900 pb-0.5 mb-2">
                Perfil Profesional
              </div>
              <p className="text-[9.5px] text-zinc-700 text-justify leading-relaxed">
                {defaultDescription}
              </p>
            </div>

            {/* Professional Experience */}
            {profile.work_experience && profile.work_experience.length > 0 && (
              <div className="mt-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-zinc-900 pb-0.5 mb-3">
                  Experiencia Laboral
                </div>
                <div className="space-y-4">
                  {profile.work_experience.map((exp, idx) => (
                    <div key={idx} className="text-[9.5px]">
                      <div className="flex justify-between items-baseline font-semibold text-zinc-900">
                        <span className="text-[10.5px]">{exp.role}</span>
                        <span className="text-zinc-500 font-normal text-[9.5px]">
                          {exp.start_date} &ndash; {exp.current ? 'Presente' : exp.end_date || ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-zinc-600 italic mt-0.5 text-[9.5px]">
                        <span>{exp.company}</span>
                        {profile.location && <span className="font-normal not-italic">{profile.location}</span>}
                      </div>
                      {exp.description && (
                        <ul className="list-disc pl-4 mt-2 text-zinc-700 space-y-1 text-justify">
                          {exp.description.split('\n').map((bullet, bIdx) => {
                            const trimmed = bullet.replace(/^[-\s*•]+/, '').trim();
                            if (!trimmed) return null;
                            return <li key={bIdx} className="leading-relaxed">{trimmed}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div className="mt-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-zinc-900 pb-0.5 mb-3">
                  Educación
                </div>
                <div className="space-y-3">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="text-[9.5px]">
                      <div className="flex justify-between items-baseline font-semibold text-zinc-900">
                        <span className="text-[10.5px]">{edu.degree}</span>
                        <span className="text-zinc-500 font-normal text-[9.5px]">
                          {edu.start_date} &ndash; {edu.end_date || 'Presente'}
                        </span>
                      </div>
                      <div className="text-zinc-600 mt-0.5 text-[9.5px]">{edu.institution}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical, Tools and Soft Skills */}
            {(technicalSkills.length > 0 || toolSkills.length > 0 || softSkills.length > 0) && (
              <div className="mt-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-zinc-900 pb-0.5 mb-2">
                  Habilidades
                </div>
                <div className="space-y-1.5 text-[9.5px] text-zinc-700">
                  {technicalSkills.length > 0 && (
                    <div className="leading-relaxed">
                      <span className="font-semibold text-zinc-900">Habilidades Técnicas: </span>
                      {technicalSkills.join(', ')}
                    </div>
                  )}
                  {toolSkills.length > 0 && (
                    <div className="leading-relaxed">
                      <span className="font-semibold text-zinc-900">Herramientas y Tecnologías: </span>
                      {toolSkills.join(', ')}
                    </div>
                  )}
                  {softSkills.length > 0 && (
                    <div className="leading-relaxed">
                      <span className="font-semibold text-zinc-900">Habilidades Blandas: </span>
                      {softSkills.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="mt-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 border-b-2 border-zinc-900 pb-0.5 mb-2">
                  Certificaciones
                </div>
                <div className="space-y-1 text-[9.5px] text-zinc-700">
                  {profile.certifications.map((cert, idx) => (
                    <div key={idx} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-semibold text-zinc-900">{cert.name}</span>
                        {cert.issuer && <span className="text-zinc-500"> &mdash; {cert.issuer}</span>}
                      </div>
                      {cert.date && <span className="text-zinc-500 text-[9.5px]">{cert.date}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Control Sidebar */}
        <div className="w-full md:w-[350px] shrink-0 border-t md:border-t-0 md:border-l border-border bg-card p-6 flex flex-col justify-between overflow-y-auto scrollbar-thin">
          <div className="space-y-6">
            <div className="space-y-2 pr-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
                <FileText className="h-4 w-4" />
                <span>CV ATS Generado</span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                Vista de Exportación
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este formato de una sola columna está diseñado y optimizado para ser fácilmente escaneado por las plataformas automáticas de reclutamiento (ATS).
              </p>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Configuración del Documento
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span>Formato:</span>
                  <span className="font-semibold text-foreground">ATS Standard (1 Columna)</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span>Idioma:</span>
                  <span className="font-semibold text-foreground">Español</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span>Fuente base:</span>
                  <span className="font-semibold text-foreground">Inter (Sans-Serif)</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Acciones de Optimización
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Adapta tu CV automáticamente analizando tus habilidades frente al mercado.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOptimizeClick}
                className="w-full text-xs font-semibold border-border hover:bg-muted cursor-pointer gap-1.5 justify-center py-5"
              >
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                Optimizar con IA (MVP)
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-6 space-y-2">
            <Button
              onClick={handlePrint}
              className="w-full text-xs font-semibold cursor-pointer gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 justify-center py-5"
            >
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <p className="text-[10px] text-center text-muted-foreground/60 leading-tight">
              Genera el archivo PDF con texto seleccionable compatible con ATS.
            </p>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
