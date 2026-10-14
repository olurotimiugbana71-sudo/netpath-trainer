// src/hooks/useLicense.ts

import { useCallback, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { validateLicense } from '../utils/license';

const STORAGE_KEY = 'netpath-trainer:license:v1';

interface StoredLicense {
  key: string;
  customerId: string;
  tier: 'premium' | 'team';
  activatedAt: string;
}

export function useLicense() {
  const [stored, setStored] = useLocalStorage<StoredLicense | null>(
    STORAGE_KEY,
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  const isPremium = stored !== null;

  const activate = useCallback(
    async (key: string): Promise<boolean> => {
      setError(null);
      setValidating(true);

      const secret = import.meta.env.VITE_LICENSE_SECRET as
        | string
        | undefined;

      if (!secret) {
        setError(
          'License system is not configured. Contact support at ' +
            '+234 806 520 9323.'
        );
        setValidating(false);
        return false;
      }

      const payload = await validateLicense(key, secret);
      setValidating(false);

      if (!payload) {
        setError('Invalid license key. Please check for typos.');
        return false;
      }

      setStored({
        key,
        customerId: payload.customerId,
        tier: payload.tier,
        activatedAt: new Date().toISOString(),
      });

      return true;
    },
    [setStored]
  );

  const deactivate = useCallback(() => {
    setStored(null);
    setError(null);
  }, [setStored]);

  return {
    isPremium,
    license: stored,
    activate,
    deactivate,
    error,
    validating,
  };
}