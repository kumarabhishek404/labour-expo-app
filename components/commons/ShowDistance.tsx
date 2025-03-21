import React from "react";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import { calculateDistance } from "@/constants/functions";
import CustomHeading from "./CustomHeading";

interface ShowDistanceProps {
  loggedInUserLocation: object;
  targetLocation: object;
}

const ShowDistance: React.FC<ShowDistanceProps> = ({
  loggedInUserLocation,
  targetLocation,
}: any) => {
  return (
    <>
      {loggedInUserLocation &&
        loggedInUserLocation?.latitude &&
        targetLocation &&
        !isNaN(calculateDistance(loggedInUserLocation, targetLocation)) && (
          <CustomHeading>
            {calculateDistance(loggedInUserLocation, targetLocation)} {t("kms")} {t('distance')}
          </CustomHeading>
        )}
    </>
  );
};

export default ShowDistance;
