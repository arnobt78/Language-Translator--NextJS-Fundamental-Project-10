# Ripple Button Effect

## Spec

- On click, a ripple element is created at the pointer position inside the button.
- The ripple expands (scale animation) and fades out, then is removed from the DOM.
- The ripple must not affect button semantics or accessibility (use `pointer-events: none`).
- Implement in a reusable component so every interactive button in the app uses the same effect.
- To avoid hydration issues, create the ripple only on the client (e.g. in a `useEffect` or inside a client component that renders the ripple on click).

## Behavior

1. User clicks the button.
2. Get click coordinates relative to the button.
3. Create a span (or div) with a class for the ripple, positioned at those coordinates.
4. Animate: scale from 0 to a large value (e.g. 2–4), opacity from ~0.3 to 0.
5. On animation end, remove the ripple element.
6. Button content and behavior unchanged; ripple is purely visual.

## Implementation notes

- Use `position: absolute` on the ripple and `position: relative` on the button wrapper so the ripple stays inside the button.
- Overflow: ensure the button has `overflow-hidden` so the ripple doesn’t spill out.
- Prefer CSS transitions/animations or a small animation library (e.g. framer-motion) for the expand/fade.
- Do not use `any`; type props and event handlers in TypeScript.
