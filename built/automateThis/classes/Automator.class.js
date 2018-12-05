"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Airtable_class_1 = require("./Airtable.class");
const nightmare_1 = require("./../factories/nightmare");
const TaskRunner_class_1 = require("./TaskRunner.class");
const AirtableFilter_class_1 = require("./AirtableFilter.class");
class default_1 {
    constructor(options) {
        this.taskRunners = [];
        this.airtableClass = new Airtable_class_1.default(options);
        this.nightmareFactory = nightmare_1.default;
        this.filterClass = new AirtableFilter_class_1.default(this, this.setFilterFetch);
    }
    setFilterFetch(getFilters) {
        this.getFilters = getFilters;
    }
    /**
     * Add a filter rule for the query used to fetch airtable data upon which the tasks iterate
     * @param columnName The airtable column name by which to filter
     * @param operator A logical operator chosen from the following: ">" | "<" | ">=" | "<=" | "=" | "!="
     * @param value The value for which the airtable column is filtered
     */
    filterRowsBy(columnName, operator, value) {
        return this.filterClass.and(columnName, operator, value);
    }
    /**
     * Create a TaskRunner that will be executed for each row found by the filters
     */
    forEachRow() {
        const taskRunner = new TaskRunner_class_1.default(this.nightmareFactory, this.airtableClass);
        this.taskRunners.push(taskRunner);
        return taskRunner;
    }
    /**
     * Perform all specified tasks
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.airtableClass.fetchRows(this.getFilters());
            for (let taskRunner of this.taskRunners) {
                yield taskRunner.run(rows);
            }
        });
    }
}
exports.default = default_1;
