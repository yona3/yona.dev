import { expect, test } from "@playwright/test";

test("home page exposes the main notes entry points", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Hello, I'm yona!" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Notes" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "yona.dev をリニューアルしました" }),
  ).toBeVisible();
});

test("notes page lists published notes and hides drafts", async ({ page }) => {
  await page.goto("/notes");

  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "yona.dev をリニューアルしました" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "ブロックスタイルテスト" }),
  ).toHaveCount(0);
});

test("note detail renders metadata and representative blocks", async ({ page }) => {
  await page.goto("/notes/site-renewal");

  await expect(
    page.getByRole("heading", { name: "yona.dev をリニューアルしました" }),
  ).toBeVisible();
  await expect(page.getByText("2026.04.26")).toBeVisible();
  await expect(page.getByText("ノート")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "サイトについて" }),
  ).toBeVisible();
  await expect(page.getByText("この note の下書きは")).toBeVisible();
});

test("legacy blog routes redirect to notes", async ({ page }) => {
  await page.goto("/blog");
  await expect(page).toHaveURL(/\/notes$/);
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();

  await page.goto("/blog/anything");
  await expect(page).toHaveURL(/\/notes$/);
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
});
