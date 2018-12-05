import AirtableClass from "./Airtable.class";
import Nightmare = require("nightmare");
import nightmareFactory from "./../factories/nightmare";
import TaskRunnerClass from "./TaskRunner.class";
import AirtableFilterClass from "./AirtableFilter.class";
import { LogicOperator } from "src/types";

export default class {
  private airtableClass: AirtableClass;
  private nightmareFactory: () => Nightmare;
  private taskRunners: TaskRunnerClass[] = [];
  private filterClass: AirtableFilterClass;
  private getFilters: () => [string, LogicOperator, number | string][];

  private setFilterFetch(getFilters: any) {
    this.getFilters = getFilters;
  }

  constructor(options: any) {
    this.airtableClass = new AirtableClass(options);
    this.nightmareFactory = nightmareFactory;
    this.filterClass = new AirtableFilterClass(this, this.setFilterFetch);
  }

  /**
   * Add a filter rule for the query used to fetch airtable data upon which the tasks iterate
   * @param columnName The airtable column name by which to filter
   * @param operator A logical operator chosen from the following: ">" | "<" | ">=" | "<=" | "=" | "!="
   * @param value The value for which the airtable column is filtered
   */
  public filterRowsBy(columnName: string, operator: LogicOperator, value: string | number): AirtableFilterClass {
    return this.filterClass.and(columnName, operator, value);
  }

  /**
   * Create a TaskRunner that will be executed for each row found by the filters
   */
  public forEachRow(): TaskRunnerClass {
    const taskRunner = new TaskRunnerClass(this.nightmareFactory, this.airtableClass);
    this.taskRunners.push(taskRunner);
    return taskRunner;
  }

  /**
   * Perform all specified tasks
   */
  public async run(): Promise<void> {
    const rows = await this.airtableClass.fetchRows(this.getFilters());
    for (let taskRunner of this.taskRunners) {
      await taskRunner.run(rows);
    }
  }
}
