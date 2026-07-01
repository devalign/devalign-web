'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import AuthCard from './auth-card';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 border-0 bg-transparent shadow-none">
        <DialogTitle className="sr-only">Autenticación</DialogTitle>
        <AuthCard onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
