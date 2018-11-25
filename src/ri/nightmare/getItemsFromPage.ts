import { IPage, IItem } from "../../types";

function browserScript(pageConfig: IPage) {
  const itemNodes: NodeList = document.querySelectorAll(
    pageConfig.itemSelector
  );
  const items: IItem[] = [];

  const runCustomFunction = (parent: HTMLElement, funcBody: string): any => {
    const func = new Function("item", "parentElement", funcBody);
    return func(null, parent);
  };

  // Loop on each item
  itemNodes.forEach((node: HTMLElement) => {
    try {
      // Get the item url via custom function or selector / property
      let url: string;

      if (pageConfig.itemUrl.funcBody) {
        url = runCustomFunction(node, pageConfig.itemUrl.funcBody);
      } else {
        url = (node.querySelector(pageConfig.itemUrl.pattern) as any)[
          pageConfig.itemUrl.prop
        ];
      }
      items.push({ url });
    } catch (e) {
      // Do nothing if error occurs
    }
  });
  return items;
}

/**
 * Navigate to the `pageConfig`'s `page` and identify all item's missing images. Return an array of itemUrls
 * @param nightmare
 * @param pageConfig
 * @param urlsToSkip An array of itemUrl's
 */
const getItemsFromPage = async (
  nightmare: any,
  pageConfig: IPage
): Promise<IItem[]> => {
  await nightmare.goto(pageConfig.page);
  await nightmare.wait(pageConfig.waitBeforeSelector);

  // Manually wait for 1 sec
  await nightmare.wait(1000);

  return await nightmare.evaluate(browserScript, pageConfig);
};

export default getItemsFromPage;
