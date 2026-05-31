import { RoadmapDashboard } from '@/components/roadmap/roadmap-dashboard';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ruta de Aprendizaje - Devalign',
  description: 'Roadmap personalizado para cerrar tus brechas técnicas',
};

export default function RoadmapPage() {
  return (
    <div className="flex-1 w-full p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <Suspense fallback={
        <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-xs text-muted-foreground">Cargando tu ruta de aprendizaje...</p>
        </div>
      }>
        <RoadmapDashboard />
      </Suspense>
    </div>
  );
}
