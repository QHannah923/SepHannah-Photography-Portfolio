const OFFSET = 10 * 60 * 60 * 1000;
const dayKey = (value) => new Date(value + OFFSET).toISOString().slice(0, 10);
function shiftMonth(month, amount) {
  const [year, number] = month.split("-").map(Number);
  return new Date(Date.UTC(year, number - 1 + amount, 1))
    .toISOString()
    .slice(0, 7);
}
function buildMonth(month, slots, now = Date.now()) {
  const [year, number] = month.split("-").map(Number);
  const count = new Date(Date.UTC(year, number, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(year, number - 1, 1)).getUTCDay() + 6) % 7;
  const today = dayKey(now);
  const usable = slots.filter(
    (s) =>
      Number.isFinite(Date.parse(s.starts_at)) &&
      Date.parse(s.starts_at) > now &&
      Date.parse(s.ends_at) > Date.parse(s.starts_at),
  );
  const cells = Array.from({ length: offset }, (_, i) => ({
    key: `blank-${i}`,
    blank: true,
  }));
  for (let n = 1; n <= count; n++) {
    const key = `${month}-${String(n).padStart(2, "0")}`;
    const available = usable.filter(
      (s) => dayKey(Date.parse(s.starts_at)) === key,
    ).length;
    cells.push({
      key,
      day: n,
      available,
      today: key === today,
      disabled: !available || key < today,
    });
  }
  return { cells, slots: usable };
}
module.exports = { dayKey, shiftMonth, buildMonth };
