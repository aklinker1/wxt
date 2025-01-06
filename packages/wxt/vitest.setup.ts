import { fakeBrowser } from '@webext-core/fake-browser';
import { vi } from 'vitest';
import { createRequire } from 'node:module';

vi.stubGlobal('chrome', fakeBrowser);
vi.stubGlobal('browser', fakeBrowser);

vi.stubGlobal('vitestCreateRequire', createRequire);
