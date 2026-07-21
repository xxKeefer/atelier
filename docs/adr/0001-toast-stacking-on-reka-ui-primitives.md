# ADR-0001: Toast stacking builds on reka-ui's Toast primitive family

- Status: accepted
- Date: 2026-07-21

## Context

`AtToast` (built across several sessions, see task history in the Obsidian vault under
`05-projects/atelier/tasks/Toast.md`) shipped with hand-rolled timeout, dismiss, and
focus-pause logic before its Stacking acceptance criterion required a container/provider
component. Only at that point did anyone check whether reka-ui -- already the primitive layer
for `AtModal` (`Dialog`) and `AtSelect` (`Select`) -- ships an equivalent for toasts.

It does: `packages/*/node_modules/reka-ui/dist/Toast/` exports `ToastProvider`, `ToastPortal`,
`ToastViewport`, `ToastRoot`, `ToastClose`, `ToastAction`, `ToastTitle`, `ToastDescription`,
`ToastAnnounce(Exclude)`. `ToastRoot` owns open/duration state and emits `pause`/`resume` when
the pointer is over the viewport, the viewport is focused, or the window blurs/focuses --
i.e. stack-wide pause, not per-toast.

This duplicated what `AtToast` had already built by hand: a `timeout` prop driving its own
`setTimeout`, and per-toast focus-pause via `relatedTarget` containment checks on focusin/focusout.

## Decision

Fully adopt reka-ui's Toast primitive family for the stacking/provider layer
(`AtToastProvider` + `useToast()`, see `05-projects/atelier/tasks/ToastProvider.md`), rather
than using reka only for positioning/portal semantics and keeping `AtToast`'s own timing logic
alongside it.

Consequence: `AtToast.vue`'s standalone timing/dismiss/pause logic (`timeout` prop, internal
`setTimeout`, focusin/focusout handlers) is removed. `AtToast` becomes purely presentational
(intent, icon, content, actions slot, close-button markup) and requires a `ToastRoot` ancestor.
Its focus-pause behavior changes from per-toast to stack-wide, inherited from reka's viewport-level
pause/resume.

## Consequences

- One timing/dismiss system in the codebase for toasts, not two competing ones.
- `AtToast` can no longer be used solo with a `timeout` prop -- any consumer needing a timed or
  keyboard-dismissible toast goes through `AtToastProvider`/`useToast()`.
- Focus-pause is now stack-wide: focusing/hovering anywhere in the toast viewport pauses every
  visible toast's timer, not just the one being interacted with. This is a deliberate narrowing
  from the original per-toast behavior `AtToast` shipped with, accepted as the cost of not
  reimplementing per-toast pause on top of reka's primitive.

## Standing rule this reinforces

`packages/ui/CLAUDE.md` already states "Build on a reka-ui primitive where one exists" -- this
was skipped for Toast because the check happened late (after the hand-rolled logic already
shipped and was tested), not because the rule didn't apply. Before implementing any non-trivial
interactive behavior (timing, focus management, open/dismiss state, swipe/drag, keyboard nav,
portal/stacking) in a new component, check reka-ui's dist for a matching primitive first:

```
find packages/ui/node_modules/reka-ui/dist -iname "*<Feature>*"
```

...before writing a hand-rolled implementation, not after.
