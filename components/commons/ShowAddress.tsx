import React from "react";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

interface ShowAddressProps {
  address: string;
}

const ShowAddress: React.FC<ShowAddressProps> = ({ address }: any) => {
  return (
    <CustomText textAlign="left" baseFont={17}>
      📍 {address || t("addressNotFound")}
    </CustomText>
  );
};

export default ShowAddress;
