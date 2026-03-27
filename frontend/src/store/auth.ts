import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  cpf: string;
  name: string;
  email?: string;
  role: string;
  tenantId: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  setAuth: (data: any) => void;
  setTenantId: (tenantId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      tenantId: null,
      setAuth: (data) => {
        const tenantId = data.user?.tenantId || data.tenantId || null;
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          tenantId,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          if (tenantId) {
            localStorage.setItem('tenantId', tenantId);
          }
        }
      },
      setTenantId: (tenantId) => {
        set({ tenantId });
        if (typeof window !== 'undefined') {
          localStorage.setItem('tenantId', tenantId);
        }
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, tenantId: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tenantId');
        }
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
