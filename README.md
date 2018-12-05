# Automate-This

Automate This is a module used to aid Airtable-based automation workflows.

This project is a bit experimental.

## How
1. Require the Automator and initialize a class with your Airtable credentials
2. Declare any desired airtable filters
3. Initialize a taskrunner by calling `automator.forEachRow()` and chain the desired combination of `.do()`, `.doIf()`, `and()`, and `andIf()` methods
  - `do` and `doIf` create a new **Task Set**. Each Task Set is executed after the proceeding Task Set.
  - `and` and `andIf` add a new **Task** (function) to the current Task Set. All Tasks in the same Task Set are executed in parallel (or as close to that as asynchronous single threaded node allows).
4. Multiple taskRunners can be created by subsequently calling `automator.forEachRow()`, though they will be simply executed as additional Task Sets.
5. Perform the defined actions by calling `automator.run()`

### Example

```js
const Automator = require("automate-this");

// airtable api key, base id, and table id
const options = {
  apiKey: process.env.AIRTABLE_API_KEY,
  baseId: process.env.AIRTABLE_BASE_ID,
  tableId: process.env.AIRTABLE_TABLE_ID,
};

const automator = new Automator(options);

// define a filter for the airtable rows
automator.filterRowsBy("Title", "=", "Hello World").and("Pages", ">=", 120);

automator.forEachRow().do((...args) => {
  // perform actions based on each airtable row
}).and((...args) => {
  // perform a second action at the same time as the first
}).then.do((...args) => {
  // perform a third action after the completion of the first two
});

// perform all previously defined steps
automator.run();
```

### Task function example
```js
//... automator class & filter defined
automator.forEachRow().do((row, nightmare, update) => {
  // each row object is a shallow copy of the original, so mutations won't be shared
  if(row.Title === "Some value") {
    row.Ordered = true;
  } else {
    row.Ordered = false;
  }
  // the update function changes the in-memory row values
  // these changes will be accessible by subsequent task sets (the next `do` call),
  //  but will not be shared within other tasks in the same group (added via `and` or `andIf`)
  update(row);
  // after all tasks sets have been performed, the automator will properly update all modified rows in Airtable
})
```

## API
TODO

## Why does this exist?

I wanted to create a system to simplify the broilerplate of various task automation projects that I was working on.

## Why Nightmare.js?

Many of the tasks that I need to work with require dynamically interacting with Javascript-rendered web pages. I've found that Nightmare.js makes this very easy to do.
