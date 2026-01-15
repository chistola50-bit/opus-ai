'use client';

import { useState } from 'react';
import { useUser } from './useUser';

interface UseCreditsResult {
  success: boolean;
  creditsUsed: number;
  remainingCredits: number;
}

export function useCredits() {
  const { refreshUser } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const useCredits = async (tool: string, inputLength: number): Promise<UseCreditsResult | null> => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/credits/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, inputLength }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to use credits');
      }

      refreshUser();
      return data;
    } catch (error) {
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { useCredits, isProcessing };
}