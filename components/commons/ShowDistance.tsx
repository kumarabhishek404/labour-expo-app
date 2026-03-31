import React, { useEffect, useMemo, useState } from "react";
import { t } from "@/utils/translationHelper";
import {
  calculateDistance,
  getLatLongFromAddress,
} from "@/constants/functions";
import CustomHeading from "./CustomHeading";

const ShowDistance = ({
  address,
  loggedInUserLocation,
  targetLocation,
  align,
}: any) => {
  const [fallbackCoords, setFallbackCoords] = useState<any>(null);

  // ✅ Normalize logged-in user coords
  const userCoords = useMemo(() => {
    if (loggedInUserLocation?.coordinates) {
      const [longitude, latitude] = loggedInUserLocation.coordinates;
      return { latitude, longitude };
    }
    return null;
  }, [loggedInUserLocation]);

  // ✅ Normalize target coords
  const targetCoords = useMemo(() => {
    if (targetLocation?.coordinates) {
      const [longitude, latitude] = targetLocation.coordinates;
      return { latitude, longitude };
    }
    return null;
  }, [targetLocation]);

  // ✅ Fallback: get coords from address
  useEffect(() => {
    const fetchCoords = async () => {
      // Only trigger if target location missing
      if (!targetCoords && address) {
        const coords = await getLatLongFromAddress(address);
        if (coords) {
          setFallbackCoords(coords);
        }
      }
    };

    fetchCoords();
  }, [address, targetCoords]);

  // ✅ Final coordinates selection
  const finalTargetCoords = targetCoords || fallbackCoords;

  // ✅ Calculate distance
  const distance = useMemo(() => {
    if (!userCoords || !finalTargetCoords) return null;

    const dist = calculateDistance(userCoords, finalTargetCoords);
    return isNaN(dist) ? null : dist;
  }, [userCoords, finalTargetCoords]);

  return (
    <CustomHeading textAlign={align ?? "center"}>
      {distance || 0} {t("kms")} {t("distance")}
    </CustomHeading>
  );
};

export default ShowDistance;
