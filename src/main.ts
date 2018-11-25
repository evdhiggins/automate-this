require("dotenv").config();

import nightmare from "./automateThis/initializers/nightmare";

import loadConfig from "./config/loadConfig";
import getItemsFromPage from "./automateThis/nightmare/getItemsFromPage";
import login from "./automateThis/nightmare/login";
import performAction from "./automateThis/nightmare/performAction";
import { IItem } from "./types";

const main = async (): Promise<void> => {
  const config = loadConfig();

  // obtain all urls to be used when performing actions
  // item urls provided via ItemListConfig are used as the base of the url array
  let items: IItem[] = config.itemList.items;
  for (let i in config.pages) {
    const pageItems: IItem[] = await getItemsFromPage(nightmare, config.pages[i]);
    items = items.concat(pageItems);
  }

  await login(nightmare, config.login);

  // loop through all items, performing the configured action(s) at each one
  for (let i in items) {
    await performAction(nightmare, config.action, items[i]);
  }

  await nightmare.end();
};

main();
