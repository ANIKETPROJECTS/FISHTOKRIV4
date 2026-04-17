import { createContext, useContext, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Customer } from "@shared/schema";
import { OtpModal } from "@/components/storefront/OtpModal";

interface CustomerContextValue {
  customer: Customer | null;
  isLoading: boolean;
  refetch: () => void;
  logout: () => Promise<void>;
  openLoginModal: () => void;
}

const CustomerContext = createContext<CustomerContextValue>({
  customer: null,
  isLoading: true,
  refetch: () => {},
  logout: async () => {},
  openLoginModal: () => {},
});

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { data: customer = null, isLoading, refetch } = useQuery<Customer | null>({
    queryKey: ["/api/customer/me"],
    queryFn: async () => {
      const res = await fetch("/api/customer/me");
      if (res.status === 401) return null;
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = useCallback(async () => {
    await fetch("/api/customer/logout", { method: "POST" });
    queryClient.setQueryData(["/api/customer/me"], null);
    queryClient.invalidateQueries({ queryKey: ["/api/customer/me"] });
    queryClient.removeQueries({ queryKey: ["/api/customer/me/orders"] });
  }, [queryClient]);

  const openLoginModal = useCallback(() => {
    setLoginModalOpen(true);
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, isLoading, refetch, logout, openLoginModal }}>
      {children}
      <OtpModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  return useContext(CustomerContext);
}
