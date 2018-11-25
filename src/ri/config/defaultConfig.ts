import { IPage, IActionConfig, ILoginConfig, IItemListConfig } from "src/types";

export const page: IPage = {
  page: process.env.WEBSITE_ADDRESS,
  itemSelector: "div > div.views-field-nothing > span.field-content",
  itemUrl: {
    pattern: "a",
    prop: "href"
  },
  waitBeforeSelector: ".node"
};

export const itemListConfig: IItemListConfig = {
  urlBases: [],
  urlCreator: () => [],
  urls: []
};

export const loginConfig: ILoginConfig = {
  loginUrl: process.env.WEBSITE_LOGIN_ADDRESS,
  usernameInputSelector: "#edit-name",
  passwordInputSelector: "#edit-pass",
  loginButtonSelector: "#edit-submit",
  waitAfterSelector: "#block-user-1"
};

export const actionConfig: IActionConfig = {
  waitBeforeSelector: "body",
  waitAfterMilliseconds: 1000,
  waitAfterSelector: "body"
};
