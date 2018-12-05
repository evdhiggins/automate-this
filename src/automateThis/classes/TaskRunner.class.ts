import Airtable = require("airtable");
import Nightmare = require("nightmare");
import { TaskFunction, RunTaskSet, UpdateFunction } from "src/types";
import TaskSetClass from "./TaskSet.class";
import AirtableClass from "./Airtable.class";
import TaskRecordClass from "./TaskRecord.class";

export default class {
  private taskSets: RunTaskSet[] = [];
  private airtableClass: AirtableClass;
  private nightmareGenerator: () => Nightmare;

  constructor(nightmareGenerator: () => Nightmare, airtableClass: AirtableClass) {
    this.nightmareGenerator = nightmareGenerator;
    this.airtableClass = airtableClass;
  }

  /**
   * A private method that is passed to a new TaskRunner so that it can add its own private `run` method to the queue
   * @param run The TaskSet run function that will be added to the taskSets queue
   */
  private addTaskSetRunner(run: RunTaskSet) {
    this.taskSets.push(run);
  }

  /**
   * Creates a new TaskSet and adds the passed function to the set
   * @param func The task function to add to the task set
   */
  public do(func: TaskFunction): TaskSetClass {
    return this.doIf(true, func);
  }

  /**
   * Create a new TaskSet that will be executed if the expression is evaluated as truthy
   * @param expression A boolean or a function that evaluates to a boolean
   * @param func The task function to add to the task set
   */
  public doIf(expression: any, func: TaskFunction): TaskSetClass {
    // yes... this feels very dirty
    const taskSet = new TaskSetClass(expression, this, this.addTaskSetRunner);
    taskSet.and(func);
    return taskSet;
  }

  /**
   * Run the queued TaskSets
   * @param rows
   */
  public async run(rows: TaskRecordClass[]): Promise<void> {
    for (let taskSet of this.taskSets) {
      for (let row of rows) {
        await taskSet(row.getFields(), this.nightmareGenerator(), row.getUpdate(row));
      }
    }
    this.airtableClass.updateAll(rows);
  }
}
