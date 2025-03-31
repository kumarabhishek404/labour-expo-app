import React from "react";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

interface ShowAddressProps {
  address: string;
  numberOfLines?: number; // Optional prop for controlling text wrapping
}

const ShowAddress: React.FC<ShowAddressProps> = ({
  address,
  numberOfLines,
}) => {
  return (
    <CustomText textAlign="left" baseFont={17} numberOfLines={numberOfLines}>
      📍  {address || t("addressNotFound")}
    </CustomText>
  );
};

export default ShowAddress;
