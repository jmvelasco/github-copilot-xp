import { expect, test } from '@jest/globals';
import { sum } from '../core/sum';

test('should sum two numbers', () => {
  const result = sum(1, 2);
  const expected = 5;

  expect(result).toBe(expected);
});
