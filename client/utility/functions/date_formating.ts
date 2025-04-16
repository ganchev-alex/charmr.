export const formatMessageTimestamp = (timestampISOString: string): string => {
  if (!timestampISOString) return "";

  let messageDate = timestampISOString.endsWith("Z")
    ? new Date(timestampISOString)
    : new Date(timestampISOString + "Z");

  const now = new Date();

  const isSameDay = (d1: Date, d2: Date): boolean =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const formatTime = (date: Date): string =>
    new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);

  const pad = (num: number): string => num.toString().padStart(2, "0");

  const formatDateShort = (date: Date): string =>
    `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;

  const formatDateFull = (date: Date): string =>
    `${formatDateShort(date)}.${date.getFullYear()}`;

  if (isSameDay(messageDate, now)) {
    return formatTime(messageDate);
  }

  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (messageDate > oneWeekAgo && messageDate < startOfToday) {
    return `${formatDateShort(messageDate)}, ${formatTime(messageDate)}`;
  }

  if (messageDate.getFullYear() === now.getFullYear()) {
    return formatDateShort(messageDate);
  }

  return formatDateFull(messageDate);
};

export const formatTimestampForNotification = (
  timestampISOString: string
): string => {
  if (!timestampISOString) return "";

  // Ensure UTC interpretation for old timestamps
  let messageDate = timestampISOString.endsWith("Z")
    ? new Date(timestampISOString)
    : new Date(timestampISOString + "Z");

  const now = new Date();

  const isSameDay = (d1: Date, d2: Date): boolean =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isYesterday = (date: Date): boolean => {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return isSameDay(date, yesterday);
  };

  const formatMonthDay = (date: Date): string =>
    new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(date);

  const formatMonthYear = (date: Date): string =>
    new Intl.DateTimeFormat(undefined, {
      month: "short",
      year: "numeric",
    }).format(date);

  if (isSameDay(messageDate, now)) {
    return "Today";
  }

  if (isYesterday(messageDate)) {
    return "Yest.";
  }

  if (messageDate.getFullYear() === now.getFullYear()) {
    return formatMonthDay(messageDate);
  }

  return formatMonthYear(messageDate);
};
