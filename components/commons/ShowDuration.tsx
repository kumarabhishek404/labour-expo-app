import { t } from "@/utils/translationHelper";
import React from "react";
import CustomText from "./CustomText";

interface ShowDurationProps {
  duration: number;
  alignment?: string;
}

const ShowDuration: React.FC<ShowDurationProps> = ({ duration, alignment }) => {
  return (
    <CustomText textAlign={alignment ? alignment : "left"}>
      ⏳  {t("duration")} {duration} {duration > 1 ? t("days") : t("day")}
    </CustomText>
  );
};

export default ShowDuration;
