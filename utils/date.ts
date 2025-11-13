export const getWeekRange = (date: Date): { start: Date, end: Date } => {
  const d = new Date(date);
  const day = d.getDay();
  // day is 0 for Sunday, 1 for Monday, etc.
  // We want Monday to be the first day of the week.
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diffToMonday));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
};
