import { DiagnosisDashboard } from '@/components/diagnosis/diagnosis-dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diagnóstico Inteligente - Devalign',
  description: 'Análisis automático de tu perfil vs. demanda del mercado IT',
};

export default function DiagnosisPage() {
  return (
    <div className="flex-1 w-full p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <DiagnosisDashboard />
    </div>
  );
}
