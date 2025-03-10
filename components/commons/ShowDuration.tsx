import { t } from "@/utils/translationHelper";
import React from "react";
import CustomText from "./CustomText";

interface ShowDurationProps {
  duration: number;
}

const ShowDuration: React.FC<ShowDurationProps> = ({ duration }) => {
  console.log("duration ---", duration);

  return (
    <CustomText textAlign="left">
      ⏳ {duration}{" "}
      {duration > 1 ? t("days") : t("day")}
    </CustomText>
  );
};

export default ShowDuration;
