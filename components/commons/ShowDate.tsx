import { t } from "@/utils/translationHelper";
import React from "react";
import CustomText from "./CustomText";
import moment from "moment";

interface DateDisplayProps {
  date: Date;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date }) => {
  const formattedDate = moment(date).format("dddd MMMM DD YYYY"); // Example: "Monday February 26"
  const [weekday, month, day, year] = formattedDate.split(" ");
  const customFormattedDate = `${day} ${t(month)} ${year}`;

  return (
    <CustomText textAlign="left">
      📅 {"  "}
      {t("startFrom", { date: customFormattedDate, day: t(weekday) })}
    </CustomText>
  );
};

export default DateDisplay;
