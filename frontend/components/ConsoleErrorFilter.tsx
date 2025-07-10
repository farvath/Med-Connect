"use client";

import { useEffect } from 'react';

export default function ConsoleErrorFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalConsoleError = console.error;
      
      console.error = (...args: any[]) => {
        // Filter out specific unauthorized errors
        const message = args.join(' ');
        
        if (
          message.includes('Error: Unauthorized') ||
          message.includes('Error fetching user: Error: Unauthorized') ||
          message.includes('401 (Unauthorized)') ||
          (message.includes('Unauthorized') && message.includes('api'))
        ) {
          // Suppress these specific auth-related errors
          return;
        }
        
        // Log all other errors normally
        originalConsoleError.apply(console, args);
      };

      // Cleanup on unmount
      return () => {
        console.error = originalConsoleError;
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
