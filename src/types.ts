export interface IItem {
  [index: string]: any;
}

export interface ISelector {
  /**
   * A CSS selector string used to locate the corresponding item field element
   */
  pattern?: string;

  /**
   * The html element property used to extract dataThe HTML element property from which text is obtained.
   * The element found by the `pattern` string is queried for the presence of this property
   */
  prop?: string;

  /**
   * A string containing **only the body of a function**. The function must contain the `return` keyword.
   *
   * This function body is passed two parameters:
   *   1. `item`: The item currently being processed, if exists.
   *   2. `parentElement`: The parent element of the current focus.
   */
  funcBody?: string;
}

export interface IPage {
  /**
   * The page url visited.
   * If the given url does not begin with `http`, the url will be automatically prefixed with `https://`
   */
  page?: string;

  /**
   * An array of page URLs or child page objects
   */
  pages?: string[] | IPage[];

  /**
   * A CSS selector string used to locate all items on the page
   */
  itemSelector?: string;

  /**
   * The selector object used to extract the itemUrl from each item found
   */
  itemUrl?: ISelector;

  /**
   * The css selector waited upon to signal the page as being fully rendered
   */
  waitBeforeSelector?: string;
}

export interface IItemListConfig {
  /**
   * The bases used to construct additional item urls (e.g. a list of product ID's read from disk)
   */
  itemBases?: any[];

  /**
   * The function used to create Urls from the urlBases
   */
  itemCreator?: (itemBases: any[]) => IItem[];

  /**
   * A list of custom item urls, or the returned value for urlCreator
   */
  items?: IItem[];
}

export interface ILoginConfig {
  /**
   * The url for the login interface.
   **/
  loginUrl?: string;

  /**
   * The CSS selector used to signal the page as rendered. If no selector string is given, the `usernameInputSelector` is used.
   **/
  waitBeforeSelector?: string;

  /**
   * The CSS selector string for the username input
   */
  usernameInputSelector?: string;

  /**
   * The CSS selector string for the password input
   */
  passwordInputSelector?: string;

  /**
   * A CSS selector string for the login / submit button
   */
  loginButtonSelector?: string;

  /**
   * The CSS selector used to confirm the login as complete.
   */
  waitAfterSelector?: string;
}

export interface IActionConfig {
  /**
   * The CSS selector used to signal the page as rendered. If no selector string is given, `body` is used.
   **/
  waitBeforeSelector?: string;

  /**
   * The number of milliseconds to wait after executing the nightmareFunc and/or the evaluateFunc. 'Waited' before `waitAfterSelector`
   */
  waitAfterMilliseconds?: number;

  /**
   * The CSS selector waited for after executing the nightmareFunc and/or the evaluateFunc. 'Waited' after `waitAfterMilliSeconds`
   **/
  waitAfterSelector?: string;

  /**
   * A async function given the initialized nightmare class as an argument. All item actions are expected to be done in this function
   */
  nightmareFunc?: (nightmare: any) => Promise<void>;

  /**
   * A function evaluated in the browser window via nightmare.evalute. `evaluateFunc` is evaluated after `nightmareFunc`
   */
  evaluateFunc?: () => Promise<void>;
}

export interface IConfig {
  action: IActionConfig;
  itemList: IItemListConfig;
  login: ILoginConfig;
  pages: IPage[];
}
