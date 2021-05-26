import { useEffect } from 'react';

export function useErrorAlert(error: Error | null, clearAlert: () => void): void {
  useEffect(() => {
    if (error !== null) {
      alert(`An error occurred: ${error.message}`);
      clearAlert();
    }
  }, [error]);
}
