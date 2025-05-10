import { t } from "@/utils/translationHelper";
import React from "react";
import CustomText from "./CustomText";
import moment from "moment";

interface DateDisplayProps {
  date: string | Date | [string | Date, string | Date]; // Can be ISO string, Date object, or array of both
  type: "startDate" | "endDate" | "date" | "dateRange";
  styles?: any; // Optional styles for the text
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date, type, styles }) => {
  // Helper function to parse date
  const parseDate = (input: string | Date) => {
    if (typeof input === "string") {
      // Check for ISO format or "DD-MM-YYYY"
      const isoParsed = moment(input, moment.ISO_8601, true);
      if (isoParsed.isValid()) return isoParsed;

      const customParsed = moment(input, "DD-M-YYYY", true);
      if (customParsed.isValid()) return customParsed;
    } else if (input instanceof Date) {
      return moment(input);
    }

    console.error("Invalid date format:", input);
    return null;
  };

  if (type === "dateRange") {
    if (!Array.isArray(date) || date.length !== 2) {
      console.error("Invalid dateRange: Expected an array with two dates.");
      return null;
    }

    // Parse start and end dates
    const start = parseDate(date[0]);
    const end = parseDate(date[1]);

    if (!start || !end) return null;

    const formattedStart = start.format("DD MMM YYYY");
    const formattedEnd = end.format("DD MMM YYYY");

    return (
      <CustomText textAlign="left">
        📅{" "}
        {t("dateRange", { startDate: formattedStart, endDate: formattedEnd })}
      </CustomText>
    );
  }

  if (typeof date === "string" || date instanceof Date) {
    const parsedDate = parseDate(date);
    if (!parsedDate) return null;

    // Extract formatted values
    const weekday = parsedDate.format("dddd"); // "Monday"
    const month = parsedDate.format("MMMM"); // "February"
    const day = parsedDate.format("DD"); // "26"
    const year = parsedDate.format("YYYY"); // "2024"

    // Translations
    const customFormattedDate = `${day} ${t(month)} ${year}`;
    const translatedWeekday = t(weekday);

    // Type-based text selection
    const typeToTextKey: Record<string, string> = {
      startDate: "startFrom",
      endDate: "endOn",
      date: "date",
    };

    const displayText = t(typeToTextKey[type], {
      date: customFormattedDate,
      day: translatedWeekday,
    });

    return <CustomText textAlign="left" style={styles}>📅 {displayText}</CustomText>;
  }
};

export default DateDisplay;
