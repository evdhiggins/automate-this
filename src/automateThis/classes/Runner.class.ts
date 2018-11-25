import Nightmare = require("nightmare");
import { ITask, IItem } from "src/types";

type TaskName = "before" | "forEach" | "after";

export default class {
  private beforeTasks: ITask[] = [];
  private forEachTasks: ITask[] = [];
  private afterTasks: ITask[] = [];
  private nightmare: Nightmare;

  constructor(nightmare: Nightmare) {
    this.nightmare = nightmare;
  }

  private addTask(taskName: TaskName, task: ITask) {
    if (typeof task !== "function") {
      throw new TypeError(
        `Received '${taskName}' task isn't a function. Only function types are accepted as 'tasks'.`
      );
    }
    if (taskName === "before") {
      this.beforeTasks.push(task);
    }
    if (taskName === "forEach") {
      this.forEachTasks.push(task);
    }
    if (taskName === "after") {
      this.forEachTasks.push(task);
    }
  }

  /**
   * Add a `before` task. `before` tasks are each performed once prior to the `forEach` tasks.
   * @param task
   */
  public doBefore(task: ITask): this {
    this.addTask("before", task);
    return this;
  }

  /**
   * Add a `forEach` task. `forEach` tasks are performed for each individual item in the received array. Each added task is performed for each item before moving on to the next task.
   * @param task
   */
  public doForEach(task: ITask): this {
    this.addTask("forEach", task);
    return this;
  }

  /**
   * Add an `after` task. `after` tasks are each performed once after the `forEach` tasks.
   * @param task
   */
  public doAfter(task: ITask): this {
    this.addTask("after", task);
    return this;
  }

  /**
   * Run all received tasks
   * @param items
   */
  public async run(items: IItem[]): Promise<void> {
    // perform all "before" tasks
    for (let i in this.beforeTasks) {
      await this.beforeTasks[i](this.nightmare, items);
    }

    // cycle through tasks, performing each task on each item
    for (let i in this.forEachTasks) {
      const task = this.forEachTasks[i];
      for (let n in items) {
        await task(this.nightmare, items[n]);
      }
    }

    // finish up by performing each 'after' task
    for (let i in this.afterTasks) {
      await this.afterTasks[i](this.nightmare, items);
    }
  }
}
