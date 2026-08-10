export type Tone = "neutral" | "success" | "warning" | "danger";
const TONE_RING: Record<Tone, string> = {
  success: "ring-green-300",
  warning: "ring-amber-300",
  danger: "ring-red-300",
  neutral: "ring-primary/30",
};
export { TONE_RING };