'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Globe, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Trash2, 
  TrendingUp,
  Star,
  Sparkles
} from 'lucide-react';

export default function ProfileAside() {
  const benefits = [
    "Especialidad técnica detectada",
    "Skills fuertes y nivel estimado",
    "Brechas críticas del mercado",
    "Roles compatibles con tu perfil",
    "Tu afinidad con el mercado actual"
  ];

  const securityItems = [
    {
      icon: Lock,
      title: "Cifrado de grado militar",
      desc: "Encriptación AES-256 para resguardar todos tus documentos."
    },
    {
      icon: EyeOff,
      title: "Privacidad absoluta",
      desc: "Tu CV es privado y nunca se comparte con terceros."
    },
    {
      icon: Trash2,
      title: "Control total",
      desc: "Eliminamos tus datos cuando tú lo decidas."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Seccion 1: Que obtendras */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            ¿Qué obtendrás?
          </h4>
          <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <ul className="space-y-3">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Seccion 2: Inteligencia de Mercado */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2 text-foreground font-bold">
          <Globe className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Inteligencia de Mercado
          </h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Nuestro motor de IA analiza continuamente miles de ofertas laborales en Perú para mantener los diagnósticos actualizados con las tendencias reales del sector IT.
        </p>
      </div>

      {/* Seccion 3: Seguridad y Privacidad */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Seguridad y Privacidad
          </h4>
          <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-4">
          {securityItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="rounded-lg bg-secondary/50 p-1.5 text-primary shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="text-xs font-semibold text-foreground">
                    {item.title}
                  </h5>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seccion 4: Social Proof */}
      <div className="rounded-2xl bg-primary-foreground/95 p-5 space-y-4 border border-primary/20 text-primary">
        <p className="text-xs font-medium leading-relaxed">
          <Sparkles className="h-3.5 w-3.5 inline-block mr-1.5 align-text-bottom text-primary fill-primary/10 animate-pulse" />
          Miles de desarrolladores ya están alineando su carrera con el mercado.
        </p>
        
        <div className="flex items-center justify-between pt-1">
          {/* Faux Avatar Group */}
          <div className="flex -space-x-2">
            {[
              { color: "bg-emerald-600", text: "JD" },
              { color: "bg-blue-600", text: "AM" },
              { color: "bg-purple-600", text: "RC" }
            ].map((av, idx) => (
              <div 
                key={idx} 
                className={`flex h-7 w-7 items-center justify-center rounded-full ${av.color} text-[8px] font-bold text-white border-2 border-primary-foreground shrink-0`}
              >
                {av.text}
              </div>
            ))}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground border-2 border-primary-foreground shrink-0">
              +2.4k
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-[10px] font-bold">4.9/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
