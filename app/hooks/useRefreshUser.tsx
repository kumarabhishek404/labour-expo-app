import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { getUserById } from "@/app/api/user";
import { toast } from "@/app/hooks/toast";
import { UserAtom } from "../AtomStore/user";

interface UserDetails {
  id: string;
  // add other user properties
}

interface UseRefreshUserReturn {
  refreshUser: (userId: string) => Promise<UserDetails | undefined>;
  isLoading: boolean;
  error: Error | null;
}

export const useRefreshUser = (): UseRefreshUserReturn => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshUser = useCallback(
    async (userId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getUserById(userId);
        console.log("response---", response);
        if (response?.data) {
          setUserDetails({ ...userDetails, ...response.data });
          toast.success("User details updated successfully");
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
    },
    [setUserDetails]
  );

  return { refreshUser, isLoading, error };
};
