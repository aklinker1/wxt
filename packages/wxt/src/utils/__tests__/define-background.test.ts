import { describe, expect, it, vi } from 'vitest';
import { defineBackground } from '../define-background';
import { BackgroundDefinition } from '../../types';

describe('defineBackground', () => {
  it('should return the object definition when given an object', () => {
    const definition: BackgroundDefinition = {
      include: [''],
      persistent: false,
      main: vi.fn(),
    };

    const actual = defineBackground(definition);

    expect(actual).toEqual(definition);
  });

  it('should return the object definition when given a main function', () => {
    const main = vi.fn();

    const actual = defineBackground(main);

    expect(actual).toEqual({ main });
  });
});
