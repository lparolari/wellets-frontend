export default function compareDate(
  a: string | Date,
  b: string | Date,
): number {
  try {
    const aDate = new Date(a);
    const bDate = new Date(b);
    return aDate.getTime() - bDate.getTime();
  } catch (err) {
    return 0;
  }
}
