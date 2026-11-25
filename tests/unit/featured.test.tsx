// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Featured } from "../../components/featured";

vi.mock("../../components/project-image", () => ({
  ProjectImage: ({ alt }: { alt: string }) => <span>{alt}</span>,
}));
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
test("the manual carousel advances and wraps", () => {
  render(
    <Featured
      slides={[
        {
          title: "Primo",
          href: "/progetti/primo",
          src: "/first",
          alt: "Prima immagine",
        },
        {
          title: "Secondo",
          href: "/progetti/secondo",
          src: "/second",
          alt: "Seconda immagine",
        },
      ]}
    />,
  );
  const next = screen.getByRole("button", { name: "Progetto successivo" });
  fireEvent.click(next);
  expect(
    screen.getByRole("link", { name: "Secondo" }).getAttribute("href"),
  ).toBe("/progetti/secondo");
  fireEvent.click(next);
  expect(screen.getByRole("link", { name: "Primo" })).toBeTruthy();
});
