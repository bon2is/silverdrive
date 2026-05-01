export const ALL_TESTS = ["memory", "trail", "reaction", "signs", "hazard"] as const;
export type TestKey = (typeof ALL_TESTS)[number];

const TEST_ROUTES: Record<TestKey, string> = {
  memory:   "/test/memory",
  trail:    "/test/trail",
  reaction: "/test/reaction",
  signs:    "/test/signs",
  hazard:   "/test/hazard",
};

/** Returns the next selected test path, or "/result-loading" if none remain. */
export function getNextTestPath(current: TestKey, selected: TestKey[]): string {
  const idx = ALL_TESTS.indexOf(current);
  for (let i = idx + 1; i < ALL_TESTS.length; i++) {
    if (selected.includes(ALL_TESTS[i])) return TEST_ROUTES[ALL_TESTS[i]];
  }
  return "/result-loading";
}

/** Returns the first selected test path. Falls back to "/result" if none selected. */
export function getFirstTestPath(selected: TestKey[]): string {
  for (const test of ALL_TESTS) {
    if (selected.includes(test)) return TEST_ROUTES[test];
  }
  return "/result";
}
