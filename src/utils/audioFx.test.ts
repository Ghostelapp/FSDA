import test from 'node:test';
import assert from 'node:assert/strict';
import { soundManager } from './audioFx';

test('soundManager handles mute state correctly', () => {
  const initial = soundManager.getIsMuted();
  soundManager.setMuted(true);
  assert.equal(soundManager.getIsMuted(), true);

  soundManager.setMuted(false);
  assert.equal(soundManager.getIsMuted(), false);

  soundManager.toggleMute();
  assert.equal(soundManager.getIsMuted(), true);

  // Restore
  soundManager.setMuted(initial);
});

test('soundManager methods do not throw in headless environment', () => {
  assert.doesNotThrow(() => {
    soundManager.playClick();
    soundManager.playSuccess();
    soundManager.playLevelUp();
    soundManager.playHeartLost();
    soundManager.playBadgeUnlocked();
  });
});
