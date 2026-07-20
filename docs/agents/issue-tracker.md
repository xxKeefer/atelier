# Issue tracker: Obsidian Kanban

Issues for this repo live as cards on a per-project kanban board in the user's Obsidian vault
(obsidian-kanban plugin format). Setup fills in the paths below — never guess them.

## Locations

- **Project workspace**: `<vault>/<projects-dir>/<project-slug>/` — the projects directory is
  found by scanning the vault for a `*projects` directory (e.g. `05-projects/`)
- **Board**: `<workspace>/<project-slug>.kanban.md`
- **Task notes**: `<workspace>/tasks/`, one note per non-trivial card, created from
  `<workspace>/tasks/_template.md`

## Board format

- Columns are `##` headings; cards are `- [ ]` checkbox lines under them. Canonical columns:
  `Backlog`, `Next`, `Doing`, `Done`. Milestone columns (e.g. `## M2 -- Surfaces`) may also
  exist. Everything after the `***` rule is the archive.
- **Column position is the card's state.** A card is closed when it sits under `Done` — the
  checkbox is incidental; don't rely on it and don't flip it.
- A card is either plain text or a wikilink (`- [ ] [[Task Name]]`) to a task note in `tasks/`.
  Inline `#tags` carry metadata (`#epic`, `#techdebt`, `#blocked`, …).
- Edit surgically: add, move, or tag the card you're operating on. Never reorder other cards,
  rewrite column headings, or touch the `%% kanban:settings %%` block at the bottom.

## Task note format

Frontmatter binds the note to the board:

```yaml
---
type: project/task
project: '[[<project-slug>.kanban]]'
status: todo
tags: [project, task]
---
```

Body: `# <Title>`, `## Context` (why the task exists, one short paragraph), `## Acceptance
Criteria` (checkboxes), `## Notes`. Task notes double as handoff documents — skills like
`/do-next` and `/update-handoff` manage their content wholesale; only the board file demands
surgical edits.

## Triage state

Triage roles are inline tags on the card, using the role strings from `triage-labels.md`
(defaults: `#needs-triage`, `#needs-info`, `#ready-for-agent`, `#ready-for-human`, `#wontfix`).
Replace the old role tag when the state changes. A `#wontfix` card moves to the archive.

## When a skill says "publish to the issue tracker"

Add a `- [ ]` card to `Backlog` (or the column the user names). If the ticket carries more than
one line of content, create a task note in `tasks/` from `_template.md` — Context and Acceptance
Criteria filled in — and make the card a wikilink to it.

## When a skill says "fetch the relevant ticket"

Find the card by name on the board; if it's a wikilink, read the task note it points to. The
user will normally pass the card text or note name directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a task note; its **child** tickets are wikilinked cards.

- **Map**: `tasks/<effort>-map.md` — the Notes / Decisions-so-far / Fog body, listing children
  in priority order. Its own card sits on the board tagged `#epic`.
- **Child ticket**: a card wikilinking `tasks/<slug>.md`. The note carries a `Type:` line
  (`research`/`prototype`/`grilling`/`task`) and the question in the body.
- **Blocking**: a `Blocked by: [[<note>]], [[<note>]]` line near the top of the child note, plus
  a `#blocked` tag on its card. Unblocked when every listed note's card is under `Done` — remove
  the tag then.
- **Frontier**: first child in map order whose card is not under `Doing`/`Done`, not `#blocked`,
  and unclaimed.
- **Claim**: move the card to `Doing` — the session's first write.
- **Resolve**: append the answer under `## Answer` in the child note, move its card to `Done`,
  then append a context pointer (gist + link) to the map's Decisions-so-far.
