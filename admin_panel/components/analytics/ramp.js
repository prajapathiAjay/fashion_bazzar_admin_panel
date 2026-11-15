// Single-hue sequential ramp (light → brand burgundy) for heatmap and cohort cells
export const RAMP = ["#FAF1F2", "#F2DFE2", "#DDA9B0", "#C77B87", "#A84D5C", "#7B2D3D"];

export function rampStep(value, min, max) {
  const t = max === min ? 0 : (value - min) / (max - min);
  const i = Math.min(RAMP.length - 1, Math.floor(t * RAMP.length));
  // Dark steps need light text to stay readable
  return { bg: RAMP[i], fg: i >= 3 ? "#FFFFFF" : "#1C1714" };
}
