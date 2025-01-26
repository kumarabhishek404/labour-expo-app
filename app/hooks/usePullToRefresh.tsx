import { useState, useCallback } from "react";

const usePullToRefresh = (fetchData: () => Promise<any>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  return {
    refreshing,
    onRefresh,
  };
};

const PULL_TO_REFRESH = {
  usePullToRefresh,
};

export default PULL_TO_REFRESH;
