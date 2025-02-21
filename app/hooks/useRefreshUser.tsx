import { useCallback, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import USER from "@/app/api/user";
import TOAST from "@/app/hooks/toast";
import Atoms from "@/app/AtomStore";
import { t } from "@/utils/translationHelper";

interface UserDetails {
  id: string;
}

interface UseRefreshUserReturn {
  refreshUser: () => Promise<UserDetails | undefined>;
  isLoading: boolean;
  error: Error | null;
}

const useRefreshUser = (): UseRefreshUserReturn => {
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setIsAccountInactive = useSetAtom(Atoms?.AccountStatusAtom);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await USER?.getUserInfo();
      if (response?.success) {
        setUserDetails({ ...userDetails, ...response.data });
        TOAST?.success(t("userDetailsFetchedSuccessfully"));
        if (response.data?.status === "ACTIVE") setIsAccountInactive(false);
        else setIsAccountInactive(true);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Error refreshing user details";
      setError(new Error(errorMessage));
      TOAST?.error(errorMessage);
      console.error("Error refreshing user details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setUserDetails]);

  return { refreshUser, isLoading, error };
};

const REFRESH_USER = {
  useRefreshUser,
};

export default REFRESH_USER;
