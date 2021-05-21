import { useEffect } from 'react';

export function useErrorAlert(error: Error | null): void {
  useEffect(() => {
    if (error !== null) {
      alert(`An error occurred: ${error.message}`);
    }
  }, [error]);
}
