import { useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect } from "react";

/**
 * `https://apnarojgar.com/job/<id>` and `apnarojgar://job/<id>` resolve here,
 * then we immediately open service details (same as manual navigation).
 */
export default function JobDeepLinkBridge() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  useLayoutEffect(() => {
    if (id) {
      router.replace({
        pathname: "/screens/service/[id]",
        params: { id: String(id) },
      });
    } else {
      router.replace("/(tabs)");
    }
  }, [id, router]);

  return null;
}
