import { render } from '@testing-library/vue';
import { expect, test } from 'vitest';
import Button from './Button.vue';

const cursorOf = (props: Record<string, unknown>) => {
  const { container } = render(Button, { props, slots: { default: () => 'Go' } });
  return getComputedStyle(container.querySelector('button')!).cursor;
};

test('enabled button shows the pointer cursor', () => {
  expect(cursorOf({})).toBe('pointer');
});

test('loading button shows the wait cursor', () => {
  expect(cursorOf({ loading: true })).toBe('wait');
});

test('disabled button shows the not-allowed cursor', () => {
  expect(cursorOf({ disabled: true })).toBe('not-allowed');
});
