export interface IItem {
  [index: string]: any;
}

export interface ITask {
  (nightmare: any, items: IItem[]): Promise<void>;
  (nightmare: any, items: IItem): Promise<void>;
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
   * An array of functions that will each be executed once
   */
  beforeTasks?: ITask[];

  /**
   * An array of functions that will each be executed once for each item
   */
  forEachTasks?: ITask[];

  /**
   * An array of functions that will each be executed once
   */
  afterTasks?: ITask[];
}

export interface IConfig {
  action: IActionConfig;
  itemList: IItemListConfig;
  login: ILoginConfig;
  pages: IPage[];
}
