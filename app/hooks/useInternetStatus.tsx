import { useEffect, useState } from "react";
// import NetInfo from "@react-native-community/netinfo";
import axios from "axios";

const useInternetStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyInternet = async () => {
      // const state = await NetInfo.fetch();

      // if (!state.isConnected || !state.isInternetReachable) {
      //   setIsConnected(false);
      //   return;
      // }

      try {
        const res = await axios.get("https://clients3.google.com/generate_204");
        setIsConnected(res.status === 204);
      } catch {
        setIsConnected(false);
      }
    };

    verifyInternet();

    //   const unsubscribe = NetInfo.addEventListener(() => {
    //     verifyInternet();
    //   });

    //   return () => unsubscribe();
  }, []);

  return isConnected;
};

export default useInternetStatus;
