"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assert = require("assert");
const assert = Assert.strict;
class default_1 {
    constructor(automator, addGetFiltersFunc) {
        this.filters = [];
        addGetFiltersFunc.call(automator, this.getFilters(this));
    }
    /**
     * Add a filter rule for the query used to fetch airtable data upon which the tasks iterate
     * @param columnName The airtable column name by which to filter
     * @param operator A logical operator chosen from the following: ">" | "<" | ">=" | "<=" | "=" | "!="
     * @param value The value for which the airtable column is filtered
     */
    and(columnName, operator, value) {
        const operators = [">", "<", ">=", "<=", "=", "!="];
        const index = operators.indexOf(operator);
        assert.ok(index > -1, `Filter's logic operator must be one of the following: ${operators.join(", ")}`);
        this.filters.push([columnName, operator, value]);
        return this;
    }
    getFilters(obj) {
        const func = () => {
            return this.filters;
        };
        func.bind(obj);
        return func;
    }
}
exports.default = default_1;
