import { describe, expect, it } from "vitest";
import { getSessionPrediction, pickPredictionId } from "@/lib/prediction";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) || null;
  }
  key(index: number) {
    return [...this.values.keys()][index] || null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("prediction session logic", () => {
  it("uses crypto-style randomness to choose a stable id", () => {
    const random = (array: Uint32Array) => {
      array[0] = 3;
      return array;
    };
    expect(pickPredictionId(random)).toBe("new-connection");
  });

  it("stores one prediction per browser session", () => {
    const storage = new MemoryStorage();
    const firstRandom = (array: Uint32Array) => {
      array[0] = 4;
      return array;
    };
    const secondRandom = (array: Uint32Array) => {
      array[0] = 7;
      return array;
    };

    expect(getSessionPrediction(storage, firstRandom)).toBe("small-steps");
    expect(getSessionPrediction(storage, secondRandom)).toBe("small-steps");
  });
});
