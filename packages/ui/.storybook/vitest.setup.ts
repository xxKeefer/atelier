import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/vue3-vite';
import * as previewAnnotations from './preview';

// Apply the preview's decorators/parameters (theme wrapper, a11y) to every
// story when it runs as a Vitest test.
const project = setProjectAnnotations([previewAnnotations]);

beforeAll(project.beforeAll);
