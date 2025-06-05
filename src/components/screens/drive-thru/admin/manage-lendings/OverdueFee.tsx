export default function OverdueFee(
  returnDate: string | null | undefined
): number {
  if (!returnDate) return 0; // No return date
  const today = new Date(Date.now());
  const dueDate = new Date(returnDate);
  if (isNaN(dueDate.getTime())) return 0; // Invalid date

  // Difference of due and today, in days (divided by ms in a day)
  const overdueDays = Math.floor((today.getTime() - dueDate.getTime()) / 86400000);

  if (overdueDays <= 0) {
    return 0; // No overdue fee if not overdue
  } else {
      const n = Math.floor(overdueDays / 7); // Full weeks overdue
      const m = overdueDays % 7; // Remaining days after full weeks
      return 3.5 * ((n + 1) * (n + 2) / 2 - 1) + 0.5 * m * (n + 2);
  }
}