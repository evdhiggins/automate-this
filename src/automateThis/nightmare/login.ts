/**
 * Sign-in to the website's log-in page using the `.env` credentials
 * @param nightmare
 * @param loginConfig
 */
const login = async (nightmare: any, loginConfig: any): Promise<void> => {
  await nightmare.goto(loginConfig.loginUrl);
  await nightmare.wait(loginConfig.waitBeforeSelector);
  await nightmare.type(
    loginConfig.usernameInputSelector,
    process.env.WEBSITE_USERNAME
  );
  await nightmare.type(
    loginConfig.passwordInputSelector,
    process.env.WEBSITE_PASSWORD
  );
  await nightmare.click(loginConfig.loginButtonSelector);
  await nightmare.wait(loginConfig.waitAfterSelector);
};

export default login;
