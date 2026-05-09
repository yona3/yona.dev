import { describe, expect, it } from "vitest";

import { parseArticleFrontmatter } from "./frontmatter";

describe("parseArticleFrontmatter", () => {
  it("parses valid frontmatter and removes a duplicated title heading", () => {
    const parsed = parseArticleFrontmatter(
      `---
title: New Note
slug: new-note
date: 2026-05-02
type: note
description: Description with: colon
published: true
updatedAt: 2026-05-03
---
# New Note

New body`,
      "new.md",
    );

    expect(parsed).toEqual({
      data: {
        title: "New Note",
        slug: "new-note",
        date: "2026-05-02",
        type: "note",
        description: "Description with: colon",
        published: true,
        updatedAt: "2026-05-03",
      },
      content: "New body",
    });
  });

  it("keeps the first heading when it does not duplicate the title", () => {
    const parsed = parseArticleFrontmatter(
      `---
title: New Note
slug: new-note
date: 2026-05-02
type: note
description: New description
published: true
---
# Different Heading

New body`,
      "new.md",
    );

    expect(parsed.content).toBe("# Different Heading\n\nNew body");
  });

  it("rejects Markdown without frontmatter", () => {
    expect(() => parseArticleFrontmatter("No frontmatter", "invalid.md")).toThrow(
      "Missing frontmatter in invalid.md",
    );
  });

  it("rejects malformed frontmatter lines", () => {
    expect(() =>
      parseArticleFrontmatter(
        `---
title New Note
slug: new-note
date: 2026-05-02
type: note
description: New description
published: true
---
Body`,
        "invalid.md",
      ),
    ).toThrow("Invalid frontmatter line in invalid.md: title New Note");
  });

  it("rejects invalid frontmatter shape", () => {
    expect(() =>
      parseArticleFrontmatter(
        `---
title: Invalid
slug: invalid
date: 2026-05-02
type: note
description: Missing published
---
Body`,
        "invalid.md",
      ),
    ).toThrow("Invalid frontmatter shape in invalid.md");
  });

  it("rejects unsupported article kinds", () => {
    expect(() =>
      parseArticleFrontmatter(
        `---
title: Invalid Kind
slug: invalid-kind
date: 2026-05-02
type: diary
description: Invalid kind
published: true
---
Body`,
        "invalid-kind.md",
      ),
    ).toThrow("Invalid article kind in invalid-kind.md: diary");
  });
});
