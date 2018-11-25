# Automate-This

A script intended to automate tasks that require interaction with a set of items (urls) that all share structure and login domain. This script is based on a stripped-down version of [picture-this](https://github.com/evdhiggins/picture-this).

Tasks automated by this script typically don't have an available API / programmatic solution, and thus must be performed through browser interaction.

This script was was quickly updated so that it could be applied to a specific task and is currently rather fragile.

## How it works

When given valid `.env` and `config.js` files the script does the following:

1. Create a set of pages from which to obtain `items` (based on page config)
2. Create an array of `items` from provided `itemBases` via `itemCreator` in itemListConfig
3. Navigate to each page defined in step 1, creating items (containing only `url` property); concatenate the page items to those created in itemListConfig
4. Sign-in, using the credentials / selectors defined in `.env` / `config.js`
5. Navigate to each `item.url`, and execute the provided functions within `actionConfig`

## Configuration details

Review the `sample.env` file to view required `.env` fields.

Details on the options available within each configuration are currently best found by reviewing the `types` file.
