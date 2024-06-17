import { getFormattedDateForUI } from "../../src/helpers/dates";

describe("getFormattedDateForUI", () => {
  it("correctly formats a known timestamp", () => {
    const ts = new Date(1718222176701);
    const expected = "[2024-06-12] 14:56";

    expect(getFormattedDateForUI(ts)).toEqual(expected);
  });
});
