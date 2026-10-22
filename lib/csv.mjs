/** Quote all cells and prevent spreadsheet formula evaluation. */
export function serializeCSV(rows) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const escape = (value) =>
    '"' +
    String(value ?? "")
      .replace(/^[\s]*[=+@-]/, "'$&")
      .replaceAll('"', '""') +
    '"';
  return [keys, ...rows.map((row) => keys.map((key) => row[key]))]
    .map((row) => row.map(escape).join(","))
    .join("\n");
}
