// /hooks/useFirstTimeLaunch.ts

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIRST_LAUNCH_KEY, LANGUAGE_KEY } from '@/constants';

// AsyncStorage.removeItem(FIRST_LAUNCH_KEY)
// AsyncStorage.removeItem(LANGUAGE_KEY)

const useFirstTimeLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
        const language = await AsyncStorage.getItem(LANGUAGE_KEY);

        console.log("firstLaunch--", firstLaunch, language);
        
        if (!firstLaunch) {
          await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
          setIsFirstLaunch(true);
        } else if (!language) {
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch status:', error);
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  return isFirstLaunch;
};

export default useFirstTimeLaunch;