import AutomatorClass from "./Automator.class";
import Assert = require("assert");
import { LogicOperator } from "src/types";
const assert = Assert.strict;

export default class {
  private filters: [string, LogicOperator, string | number][] = [];

  constructor(automator: AutomatorClass, addGetFiltersFunc: Function) {
    addGetFiltersFunc.call(automator, this.getFilters(this));
  }

  /**
   * Add a filter rule for the query used to fetch airtable data upon which the tasks iterate
   * @param columnName The airtable column name by which to filter
   * @param operator A logical operator chosen from the following: ">" | "<" | ">=" | "<=" | "=" | "!="
   * @param value The value for which the airtable column is filtered
   */
  public and(columnName: string, operator: LogicOperator, value: string | number): this {
    const operators = [">", "<", ">=", "<=", "=", "!="];
    const index = operators.indexOf(operator);
    assert.ok(
      index > -1,
      `Filter's logic operator must be one of the following: ${operators.join(", ")}`
    );
    this.filters.push([columnName, operator, value]);
    return this;
  }

  private getFilters(obj: this) {
    const func = () => {
      return this.filters;
    };
    func.bind(obj);
    return func;
  }
}
