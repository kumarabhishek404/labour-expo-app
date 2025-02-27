import { t } from "@/utils/translationHelper";
import React from "react";
import { StyleSheet } from "react-native";
import CustomText from "./CustomText";
import moment from "moment";
import Colors from "@/constants/Colors";

interface DateDisplayProps {
  date: Date;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date }) => {
  const formattedDate = moment(date).format("dddd MMMM DD"); // Example: "Monday February 26"
  const [weekday, month, day] = formattedDate.split(" ");
  const customFormattedDate = `${day} ${t(weekday)} ${t(month)}`;

  return (
    <CustomText textAlign="left">
      {t("startFrom", { date: customFormattedDate })}
    </CustomText>
  );
};

export default DateDisplay;