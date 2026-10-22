import test from "node:test";
import assert from "node:assert/strict";
import { serializeCSV } from "../lib/csv.mjs";
test("exports headers and quotes commas, quotes, and line breaks", () => {
  assert.equal(
    serializeCSV([{ name: 'Olivia, "Rhye"', note: "first\nsecond" }]),
    '"name","note"\n"Olivia, ""Rhye""","first\nsecond"',
  );
});
test("neutralizes spreadsheet formulas including leading whitespace", () => {
  for (const value of ["=SUM(A1)", "+1", "-1", "@test", "  =1"])
    assert.ok(serializeCSV([{ value }]).includes("\"'"));
});
test("handles an empty report and absent values", () => {
  assert.equal(serializeCSV([]), "");
  assert.equal(serializeCSV([{ value: null }]), '"value"\n""');
});
