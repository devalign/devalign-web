import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-96 bg-muted/60 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-muted rounded-lg" />
          <div className="h-10 w-28 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">
        <div className="space-y-5">
          {/* Summary Card Skeleton */}
          <Card className="card-standard overflow-hidden border border-border/40 bg-card">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="h-7 w-64 bg-muted rounded-lg" />
                  <div className="flex gap-2">
                    <div className="h-5 w-40 bg-muted rounded" />
                    <div className="h-5 w-12 bg-muted rounded-full" />
                  </div>
                </div>
                <div className="h-9 w-36 bg-muted rounded-lg" />
              </div>
              <div className="h-24 w-full bg-muted/30 rounded-xl border border-primary/5 p-4 space-y-2">
                <div className="h-4 w-full bg-muted/60 rounded" />
                <div className="h-4 w-[90%] bg-muted/60 rounded" />
                <div className="h-4 w-[75%] bg-muted/60 rounded" />
              </div>
            </CardContent>
          </Card>

          {/* Technical Competencies Card Skeleton */}
          <Card className="card-standard overflow-hidden border border-border/40 bg-card">
            <CardContent className="p-6 space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-muted rounded-xl" />
                    <div className="h-6 w-44 bg-muted rounded" />
                  </div>
                  <div className="h-4 w-72 bg-muted/60 rounded" />
                </div>
                <div className="h-9 w-80 bg-muted rounded-lg" />
              </div>

              {/* Skills Tags Skeleton */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-9 w-24 bg-muted rounded-lg"
                    style={{ width: `${Math.floor(Math.random() * (120 - 70) + 70)}px` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="space-y-5">
          <Card className="card-standard overflow-hidden border border-border/40 bg-card">
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-muted rounded" />
                  <div className="h-5 w-36 bg-muted rounded" />
                </div>
                <div className="h-3 w-56 bg-muted/60 rounded" />
              </div>

              {/* Affinities list */}
              <div className="space-y-4 pt-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-4 w-8 bg-muted rounded" />
                    </div>
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                      <div className="h-2 w-full bg-muted rounded-full" />
                      <div className="h-8 w-24 bg-muted rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-9 w-full bg-muted rounded-lg mt-2" />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
