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
    if (loggedInUserLocation?.coordinates?.length >= 2) {
      const [longitude, latitude] = loggedInUserLocation.coordinates;
      const lat = Number(latitude);
      const lng = Number(longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return { latitude: lat, longitude: lng };
    }
    return null;
  }, [loggedInUserLocation]);

  const targetCoords = useMemo(() => {
    if (targetLocation?.coordinates?.length >= 2) {
      const [longitude, latitude] = targetLocation.coordinates;
      const lat = Number(latitude);
      const lng = Number(longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return { latitude: lat, longitude: lng };
    }
    return null;
  }, [targetLocation]);

  // Geocode service address only when we already have user coords (no permission prompt).
  useEffect(() => {
    const fetchCoords = async () => {
      if (!userCoords) {
        setFallbackCoords(null);
        return;
      }
      if (targetCoords) {
        setFallbackCoords(null);
        return;
      }
      if (!address?.trim()) return;

      const coords = await getLatLongFromAddress(address);
      setFallbackCoords(coords ?? null);
    };

    fetchCoords();
  }, [address, targetCoords, userCoords]);

  // ✅ Final coordinates selection
  const finalTargetCoords = targetCoords || fallbackCoords;

  // ✅ Calculate distance
  const distance = useMemo(() => {
    if (!userCoords || !finalTargetCoords) return null;

    const dist = calculateDistance(userCoords, finalTargetCoords);
    return isNaN(dist) ? null : dist;
  }, [userCoords, finalTargetCoords]);

  if (distance == null) {
    return null;
  }

  return (
    <CustomHeading textAlign={align ?? "center"}>
      {distance} {t("kms")} {t("distance")}
    </CustomHeading>
  );
};

export default ShowDistance;
