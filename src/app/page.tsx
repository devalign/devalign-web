import type { Metadata } from 'next';
import HomeClient from './_components/home-client';

export const metadata: Metadata = {
  title: 'Devalign | Diagnóstico técnico con IA',
  description:
    'Analiza tu CV y descubre tu brecha técnica con IA.',
};

export default function Home() {
  return <HomeClient />;
}
