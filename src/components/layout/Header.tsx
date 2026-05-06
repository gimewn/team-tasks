'use client';

import { PlusIcon, MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onNewTask?: () => void;
}

export function Header({ title, subtitle, onNewTask }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden -ml-2" />}>
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="text-xl font-bold text-foreground leading-none">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {onNewTask && (
        <Button
          onClick={onNewTask}
          className="bg-primary hover:bg-primary/90 shadow-sm"
          size="sm"
        >
          <PlusIcon className="size-4 mr-1.5" />
          새 일감
        </Button>
      )}
    </header>
  );
}
