require("dotenv").config();

import nightmare from "./ri/initializers/nightmare";

import loadConfig from "./ri/config/loadConfig";
import getUrls from "./ri/nightmare/getUrls";
import login from "./ri/nightmare/login";
import performAction from "./ri/nightmare/performAction";

const main = async (): Promise<void> => {
  const config = loadConfig();

  // obtain all urls to be used when performing actions
  // item urls provided via ItemListConfig are used as the base of the url array
  let urls: string[] = config.itemList.urls;
  for (let i in config.pages) {
    const pageUrls: string[] = await getUrls(nightmare, config.pages[i]);
    urls = urls.concat(pageUrls);
  }

  await login(nightmare, config.login);

  // loop through all urls, performing the configured action(s) at each one
  for (let i in urls) {
    await performAction(nightmare, config.action, urls[i]);
  }

  await nightmare.end();
};

main();
