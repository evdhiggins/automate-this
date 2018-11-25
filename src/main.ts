require("dotenv").config();

import nightmare from "./automateThis/initializers/nightmare";

import loadConfig from "./config/loadConfig";
import getItemsFromPage from "./automateThis/nightmare/getItemsFromPage";
import login from "./automateThis/nightmare/login";
import { IItem } from "./types";
import RunnerClass from "./automateThis/classes/Runner.class";

const main = async (): Promise<void> => {
  const config = loadConfig();

  await login(nightmare, config.login);

  // obtain all urls to be used when performing actions
  // item urls provided via ItemListConfig are used as the base of the url array
  let items: IItem[] = config.itemList.items;
  for (let i in config.pages) {
    const pageItems: IItem[] = await getItemsFromPage(nightmare, config.pages[i]);
    items = items.concat(pageItems);
  }

  const runner = new RunnerClass(nightmare);

  config.action.beforeTasks.forEach(task => runner.doBefore(task));
  config.action.forEachTasks.forEach(task => runner.doForEach(task));
  config.action.afterTasks.forEach(task => runner.doAfter(task));

  await runner.run(items);

  await nightmare.end();
};

main();
