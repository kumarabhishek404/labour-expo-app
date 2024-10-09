export const dateDifference = (date1: Date, date2: Date): string => {
  // Convert both dates to milliseconds
  const date1Ms = new Date(date1).getTime();
  const date2Ms = new Date(date2).getTime();

  // Calculate the absolute difference in milliseconds
  const diffMs = Math.abs(date2Ms - date1Ms);

  // Calculate the difference in days
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // If the difference is less than 30 days, return in days
  if (diffDays < 30) {
    return `${Math.round(diffDays)} ${
      Math.round(diffDays) > 1 ? "Days" : "Day"
    }`;
  }

  // Calculate the difference in months
  const diffMonths = diffDays / 30;

  // If the difference is less than 12 months, return in months
  if (diffMonths < 12) {
    return `${Math.round(diffMonths)} ${
      Math.round(diffMonths) > 1 ? "Months" : "Month"
    }`;
  }

  // Otherwise, calculate the difference in years
  const diffYears = diffMonths / 12;
  return `${Math.round(diffYears)} ${
    Math.round(diffYears) > 1 ? "Years" : "Year"
  }`;
};


export const getTimeAgo = (createdOn: Date) => {
  const createdAt = new Date(createdOn);
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} days ago`;
  } else if (hours > 0) {
    return `${hours} hours ago`;
  } else if (minutes > 0) {
    return `${minutes} minutes ago`;
  } else {
    return `${seconds} seconds ago`;
  }
}