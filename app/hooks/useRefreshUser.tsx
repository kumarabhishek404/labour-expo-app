import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { getUserInfo } from "@/app/api/user";
import { toast } from "@/app/hooks/toast";
import { UserAtom } from "../AtomStore/user";
import { t } from "@/utils/translationHelper";

interface UserDetails {
  id: string;
  // add other user properties
}

interface UseRefreshUserReturn {
  refreshUser: () => Promise<UserDetails | undefined>;
  isLoading: boolean;
  error: Error | null;
}

export const useRefreshUser = (): UseRefreshUserReturn => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserInfo();
      if (response?.success) {
        setUserDetails({ ...userDetails, ...response.data });
        toast.success(t("userDetailsFetchedSuccessfully"));
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Error refreshing user details";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      console.error("Error refreshing user details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setUserDetails]);

  return { refreshUser, isLoading, error };
};
