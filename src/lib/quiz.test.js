import { describe, it, expect } from "vitest";
import { normalizeAnswer, matchesPracticeAnswer } from "./quiz";

describe("normalizeAnswer", () => {
  it("should collapse extra spaces", () => {
    expect(normalizeAnswer("ls    -la")).toBe("ls -la");
  });

  it("should normalize redirection pipes and symbols", () => {
    expect(normalizeAnswer("cat file|grep text")).toBe("cat file | grep text");
    expect(normalizeAnswer("echo 'hello'>out.txt")).toBe("echo 'hello' > out.txt");
    expect(normalizeAnswer("echo 'hello'>>out.txt")).toBe("echo 'hello' >> out.txt");
  });

  it("should remove semicolon suffixes like then/do", () => {
    expect(normalizeAnswer("if [ -f test.sh ]; then")).toBe("if [ -f test.sh ]");
    expect(normalizeAnswer("for file in *; do")).toBe("for file in *");
  });
});

describe("matchesPracticeAnswer", () => {
  it("should match correct answers ignoring minor spacing variance", () => {
    expect(matchesPracticeAnswer("ls   -la", ["ls -la"])).toBe(true);
  });

  it("should return true for valid command matches", () => {
    const accepted = ["mkdir -p src/components", "mkdir src/components -p"];
    expect(matchesPracticeAnswer("mkdir  -p  src/components", accepted)).toBe(true);
  });

  it("should match loop and conditional constructs without suffix", () => {
    expect(matchesPracticeAnswer("if [ -d /tmp ]", ["if [ -d /tmp ]; then"])).toBe(true);
    expect(matchesPracticeAnswer("for i in {1..5}", ["for i in {1..5}; do"])).toBe(true);
  });
});
