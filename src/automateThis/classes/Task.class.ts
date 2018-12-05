import Airtable = require("airtable");
import Nightmare = require("nightmare");
import { Task, UpdateFunction } from "src/types";

export default class {
  private task: Task;
  constructor(task: any) {
    this.task = task;
    if (typeof task.expression === "boolean") {
      this.task.expression = () => task.expression;
    }
  }
  public async run(
    row: Airtable.RecordData,
    nightmare: Nightmare,
    update: UpdateFunction
  ): Promise<void> {
    let expressionValue: boolean;
    try {
      expressionValue = !!this.task.expression(row);
    } catch (e) {
      // handle evaluation error as falsey expression
      expressionValue = false;
    }
    if (expressionValue) {
      await this.task.func(row, nightmare, update);
    }
  }
}
