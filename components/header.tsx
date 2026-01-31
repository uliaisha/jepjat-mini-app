'use client';

import React from "react"

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function Header({ title, showBack = false, rightElement }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 -ml-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        {rightElement}
      </div>
    </header>
  );
}
