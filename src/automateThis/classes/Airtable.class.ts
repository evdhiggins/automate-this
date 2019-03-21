import Airtable = require("Airtable");
import Assert = require("assert");
import TaskRecordClass from "./TaskRecord.class";
import { LogicOperator } from "src/types";
const assert = Assert.strict;

type AirtableOptions = {
  apiKey?: string;
  baseId?: string;
  tableId?: string;
};

type AirtableFilters = [string, LogicOperator, number | string][];

const sleep = (milliseconds: number) =>
  new Promise(res => {
    setTimeout(() => res(), milliseconds);
  });

export default class {
  private airtable: Airtable;
  private base: Airtable.Base;
  private table: Airtable.Table;
  private instanceOptions: AirtableOptions = {};

  constructor(options: AirtableOptions = {}) {
    this.setOptions(options);
  }

  /**
   * Change the AirtableClass instance's options.
   * @param options
   */
  public setOptions(options: AirtableOptions = {}): void {
    const newOptions: AirtableOptions = {};
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

  public async fetchRows(filters: AirtableFilters): Promise<TaskRecordClass[]> {
    // create string containing logical statements for filter
    const filterString: string = filters
      .map(([columnName, operator, value]) => {
        assert.strictEqual(typeof columnName, "string", "Filter column name must be a string");
        return `{${columnName}} ${operator} "${String(value).replace(/"/g, '\\"')}"`;
      })
      .join(",");

    const records: Airtable.Record[] = [];
    await this.table
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

    return records.map(record => new TaskRecordClass(record));
  }

  public async updateRow(
    recordId: string,
    recordData: Airtable.RecordData
  ): Promise<Airtable.Record> {
    const record = await this.table.update(recordId, recordData);
    return record;
  }

  /**
   * Update an array of records, sleeping for 300 milliseconds between each update call
   * @param records
   */
  public async updateAll(records: TaskRecordClass[]): Promise<void> {
    for (let record of records) {
      if (record.isUpdated) {
        this.table.update(record.getId(), record.getUpdateFields()).catch(e => {
          console.error('\n');
          console.error(`Error updating Airtable row ${record.getId()}:`);
          console.error(`Message: ${e.message}`);
          console.error(`Attempted update values: `);
          console.error(record.getUpdateFields());

        });
        await sleep(300);
      }
    }
  }
}
