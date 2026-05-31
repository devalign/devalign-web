import { RoadmapDashboard } from '@/components/roadmap/roadmap-dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ruta de Aprendizaje - Devalign',
  description: 'Roadmap personalizado para cerrar tus brechas técnicas',
};

export default function RoadmapPage() {
  return (
    <div className="flex-1 w-full p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <RoadmapDashboard />
    </div>
  );
}
