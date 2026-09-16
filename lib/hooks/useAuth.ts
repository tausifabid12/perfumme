"use client";

import { useState, useEffect, useCallback } from "react";

export interface AuthCustomer {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface AuthState {
  customer: AuthCustomer | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ customer: null, loading: true });

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) { setState({ customer: null, loading: false }); return; }
      const data = await res.json();
      setState({ customer: data.customer ?? null, loading: false });
    } catch {
      setState({ customer: null, loading: false });
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  return state;
}
