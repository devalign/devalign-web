'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Plus, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchSkills } from '@/lib/api/user-service';
import type { SkillSearchResult } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface SkillAutocompleteInputProps {
  onAddSkill: (skill: { name: string; skill_type?: string; is_custom?: boolean }) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function SkillAutocompleteInput({
  onAddSkill,
  placeholder = 'Ej. React, Docker, AWS...',
  disabled = false,
  className,
  autoFocus = false,
}: SkillAutocompleteInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SkillSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hasError, setHasError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const results = await searchSkills(trimmed, 10);
        setSuggestions(results);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Error fetching skill suggestions:', err);
        setSuggestions([]);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectSkill = useCallback(
    (skillName: string, skillType = 'tech', isCustom = false) => {
      const cleanName = skillName.trim();
      if (!cleanName) return;

      onAddSkill({ name: cleanName, skill_type: skillType, is_custom: isCustom });
      setQuery('');
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    },
    [onAddSkill],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      const item = suggestions[selectedIndex];
      handleSelectSkill(item.name, item.skill_type, false);
    } else if (query.trim()) {
      handleSelectSkill(query.trim(), 'tech', true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              setIsOpen(true);
              if (!val.trim()) {
                setSuggestions([]);
                setIsLoading(false);
                setHasError(false);
              }
            }}
            onFocus={() => {
              if (query.trim().length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            className="h-10 pr-9 bg-card text-foreground border-border text-xs focus-visible:ring-primary"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Search className="h-4 w-4 opacity-50" />
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={disabled || !query.trim()}
          className="h-10 text-xs font-bold shrink-0 gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar</span>
        </Button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-border bg-card shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150">
          {isLoading && suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Buscando en el catálogo oficial de Lightcast...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>Sugerencias del catálogo oficial</span>
              </div>
              {suggestions.map((item, index) => {
                const isSelected = index === selectedIndex;
                const domainLabel =
                  item.subcategory_name ||
                  (item.core_domains && item.core_domains.length > 0
                    ? item.core_domains[0]
                    : item.skill_type);

                return (
                  <button
                    key={item.id || `${item.name}-${index}`}
                    type="button"
                    onClick={() => handleSelectSkill(item.name, item.skill_type, false)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors cursor-pointer',
                      isSelected ? 'bg-secondary text-foreground' : 'hover:bg-secondary/60 text-foreground',
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold truncate">{item.name}</span>
                    </div>
                    {domainLabel && (
                      <span className="text-[10px] font-bold text-muted-foreground bg-secondary/80 border border-border/40 px-2 py-0.5 rounded-full shrink-0 ml-2">
                        {domainLabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : hasError ? (
            <div className="p-3 text-center text-xs text-destructive">
              <p>No se pudo conectar con el catálogo de habilidades.</p>
              <button
                type="button"
                onClick={() => handleSelectSkill(query.trim(), 'tech', true)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar &quot;{query.trim()}&quot; como competencia personalizada
              </button>
            </div>
          ) : (
            <div className="p-3 text-center text-xs text-muted-foreground">
              <p>No se encontró en el catálogo de Lightcast.</p>
              <button
                type="button"
                onClick={() => handleSelectSkill(query.trim(), 'tech', true)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar &quot;{query.trim()}&quot; como competencia personalizada
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
