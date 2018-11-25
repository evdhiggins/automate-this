import * as Nightmare from "nightmare";

// Initialize
const nightmare: Nightmare = new Nightmare({
  show: process.env.MISC_DISPLAY_WINDOW === "T",
  waitTimeout: 20000
});

export default nightmare;
