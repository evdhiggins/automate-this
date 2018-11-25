import { IActionConfig } from "src/types";

const performAction = async (
  nightmare: any,
  actionConfig: IActionConfig,
  url: string
): Promise<void> => {
  await nightmare.goto(url);
  await nightmare.wait(actionConfig.waitBeforeSelector);

  if (typeof actionConfig.nightmareFunc === "function")
    await actionConfig.nightmareFunc(nightmare);

  if (typeof actionConfig.evaluateFunc === "function")
    await nightmare.evaluate(actionConfig.evaluateFunc);

  if (typeof actionConfig.waitAfterMilliseconds === "number")
    await nightmare.wait(actionConfig.waitAfterMilliseconds);

  if (typeof actionConfig.waitAfterSelector === "string")
    await nightmare.wait(actionConfig.waitAfterSelector);
};

export default performAction;
