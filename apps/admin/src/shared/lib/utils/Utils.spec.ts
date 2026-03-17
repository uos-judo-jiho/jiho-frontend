import { describe, it, expect } from "vitest";
import { formatAwardsType, vaildNewsYearList } from "./Utils";
import { AwardType } from "../types/AwardType";

describe("Utils", () => {
  describe("formatAwardsType", () => {
    it("should format awards with gold, silver, and bronze", () => {
      const award: AwardType = {
        title: "Test Award",
        gold: 1,
        silver: 2,
        bronze: 3,
        menGroup: 0,
        womenGroup: 0,
        group: 0,
      };
      expect(formatAwardsType(award).trim()).toBe("금 1 은 2 동 3");
    });

    it("should format awards with group rankings", () => {
      const award: AwardType = {
        title: "Test Award",
        gold: 0,
        silver: 0,
        bronze: 0,
        menGroup: 1,
        womenGroup: 2,
        group: 3,
      };
      expect(formatAwardsType(award).trim()).toBe(
        "남자 단체전 1 위 여자 단체전 2 위 혼성 단체전 3 위",
      );
    });

    it("should return empty string if no awards", () => {
      const award: AwardType = {
        title: "Test Award",
        gold: 0,
        silver: 0,
        bronze: 0,
        menGroup: 0,
        womenGroup: 0,
        group: 0,
      };
      expect(formatAwardsType(award)).toBe("");
    });
  });

  describe("vaildNewsYearList", () => {
    it("should return a list of years starting from 2022", () => {
      const years = vaildNewsYearList();
      expect(years[0]).toBe("2022");
      expect(years.length).toBeGreaterThan(0);
    });
  });
});
