import type { Metadata } from 'next';
import HomeClient from './_components/home-client';

export const metadata: Metadata = {
  title: 'Devalign | Diagnóstico técnico con IA',
  description:
    'Analiza tu CV, descubre tu brecha técnica y recibe un roadmap personalizado con IA.',
};

export default function Home() {
  return <HomeClient />;
}
