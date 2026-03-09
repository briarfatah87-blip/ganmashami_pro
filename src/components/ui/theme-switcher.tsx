"use client"

import React from 'react'
import { Palette, Check } from 'lucide-react'
import { useTheme, themeColors } from '@/lib/theme-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Palette className="h-5 w-5" />
          <span 
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: currentTheme.primary }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Choose Theme Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeColors.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => setTheme(theme)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-5 h-5 rounded-full border-2 border-gray-600"
                style={{ backgroundColor: theme.primary }}
              />
              <span>{theme.name}</span>
            </div>
            {currentTheme.name === theme.name && (
              <Check className="h-4 w-4" style={{ color: theme.primary }} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
