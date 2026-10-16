/**
 * Smoothed story time shared by every WebGL actor. Updated once per frame by
 * <StageClock /> (mounted first, so it runs before the other useFrame hooks).
 */
export const stage = {
  t: 0,
  time: 0,
  /** Accumulated phases for the atmosphere so speed changes never jump */
  risePhase: 0,
  swirlPhase: 0,
};
