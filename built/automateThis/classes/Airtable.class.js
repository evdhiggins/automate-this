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
const Airtable = require("Airtable");
const Assert = require("assert");
const TaskRecord_class_1 = require("./TaskRecord.class");
const assert = Assert.strict;
const sleep = (milliseconds) => new Promise(res => {
    setTimeout(() => res(), milliseconds);
});
class default_1 {
    constructor(options = {}) {
        this.instanceOptions = {};
        this.setOptions(options);
    }
    /**
     * Change the AirtableClass instance's options.
     * @param options
     */
    setOptions(options = {}) {
        const newOptions = {};
        newOptions.apiKey = options.apiKey ? options.apiKey : this.instanceOptions.apiKey;
        newOptions.baseId = options.baseId ? options.baseId : this.instanceOptions.baseId;
        newOptions.tableId = options.tableId ? options.tableId : this.instanceOptions.tableId;
        // create a new instance of airtable when api key changes
        if (newOptions.apiKey !== this.instanceOptions.apiKey) {
            this.airtable = new Airtable(newOptions);
        }
        if (newOptions.baseId !== this.instanceOptions.baseId) {
            this.base = this.airtable.base(newOptions.baseId);
        }
        if (newOptions.tableId !== this.instanceOptions.tableId) {
            this.table = this.base(newOptions.tableId);
        }
        this.instanceOptions = newOptions;
    }
    fetchRows(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            // create string containing logical statements for filter
            const filterString = filters
                .map(([columnName, operator, value]) => {
                assert.strictEqual(typeof columnName, "string", "Filter column name must be a string");
                return `{${columnName}} ${operator} "${String(value).replace(/"/g, '\\"')}"`;
            })
                .join(",");
            const records = [];
            yield this.table
                .select({
                filterByFormula: `AND(${filterString})`,
                maxRecords: 100,
            })
                .eachPage((rs, next) => {
                rs.forEach(record => {
                    records.push(record);
                });
                next();
            });
            return records.map(record => new TaskRecord_class_1.default(record));
        });
    }
    updateRow(recordId, recordData) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this.table.update(recordId, recordData);
            return record;
        });
    }
    /**
     * Update an array of records, sleeping for 300 milliseconds between each update call
     * @param records
     */
    updateAll(records) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let record of records) {
                if (record.isUpdated) {
                    this.table.update(record.getId(), record.getFields());
                    yield sleep(300);
                }
            }
        });
    }
}
exports.default = default_1;
