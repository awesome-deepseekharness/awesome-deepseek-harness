import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateMilestone } from './update-repo-stars.mjs';

const en = 'Before **3 → 100 stars is our first milestone (97 to go)** after';
const zh = '之前 **3 → 100 颗星是第一里程碑（还差 97）** 之后';
test('updates bilingual counts and preserves surrounding copy', () => {
  assert.equal(updateMilestone(en, 18, 'en'), 'Before **18 → 100 stars is our first milestone (82 to go)** after');
  assert.equal(updateMilestone(zh, 18, 'zh'), '之前 **18 → 100 颗星是第一里程碑（还差 82）** 之后');
});
test('handles zero, unstars, reached and exceeded goals, and repeated refreshes', () => {
  for (const count of [0, 2, 100, 123]) {
    const updated = updateMilestone(en, count, 'en');
    assert.ok(updated.includes(`(${Math.max(0, 100 - count)} to go)`));
    assert.equal(updateMilestone(updated, count, 'en'), updated);
    assert.ok(updateMilestone(zh, count, 'zh').includes(`（还差 ${Math.max(0, 100 - count)}）`));
  }
});
test('rejects bad API counts and missing or ambiguous milestones', () => {
  for (const count of [undefined, null, '18', -1, 1.2, Infinity]) {
    assert.throws(() => updateMilestone(en, count, 'en'));
  }
  assert.throws(() => updateMilestone('missing', 18, 'en'));
  assert.throws(() => updateMilestone(en + en, 18, 'en'));
});
