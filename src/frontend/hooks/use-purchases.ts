"use client";

import { useCallback, useEffect, useState } from "react";
import { listPurchases } from "@/backend/services/purchases";
import type { DcaPoint } from "@/frontend/data/bitcoin";

type PurchasesState = {
  purchases: DcaPoint[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  prependPurchase: (purchase: DcaPoint) => void;
  removePurchase: (id: string) => void;
  replacePurchase: (purchase: DcaPoint) => void;
};

export function usePurchases(): PurchasesState {
  const [purchases, setPurchases] = useState<DcaPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const result = await listPurchases();

    if (result.data === null) {
      setPurchases([]);
      setError(result.error);
      setLoading(false);
      return;
    }

    setPurchases(result.data);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  function prependPurchase(purchase: DcaPoint) {
    setPurchases((current) => [
      {
        ...purchase,
        id: current.length + 1,
      },
      ...current,
    ]);
  }

  function removePurchase(id: string) {
    setPurchases((current) => current.filter((purchase) => purchase.dbId !== id));
  }

  function replacePurchase(purchase: DcaPoint) {
    setPurchases((current) =>
      current.map((item) => (item.dbId === purchase.dbId ? purchase : item)),
    );
  }

  return {
    purchases,
    loading,
    error,
    reload,
    prependPurchase,
    removePurchase,
    replacePurchase,
  };
}
