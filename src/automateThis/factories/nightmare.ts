import * as Nightmare from "nightmare";

export default () => {
  return new Nightmare({
    show: process.env.MISC_DISPLAY_WINDOW === "T",
    waitTimeout: 20000,
  });
};
