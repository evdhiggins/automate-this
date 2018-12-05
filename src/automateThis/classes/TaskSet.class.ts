import Airtable = require("airtable");
import Nightmare = require("nightmare");
import TaskRunnerClass from "./TaskRunner.class";
import { TaskFunction, TaskExpression, RunTaskSet, UpdateFunction } from "src/types";
import TaskClass from "./Task.class";

export default class {
  /**
   * An expression that will determine if the task set will be run
   */
  private expression: TaskExpression;

  /**
   * Add a new task set or conditional task set
   */
  public then: TaskRunnerClass;

  /**
   * The tasks belonging to this task set
   */
  private tasks: TaskClass[] = [];

  constructor(
    expression: any,
    taskRunner: TaskRunnerClass,
    addTaskSetRunner: (run: RunTaskSet) => void
  ) {
    if (typeof expression === "boolean") {
      this.expression = () => expression;
    } else {
      this.expression = expression;
    }
    this.then = taskRunner;

    // add this TaskSet's private `run` method to the parent TaskRunner's queue
    addTaskSetRunner.call(taskRunner, this.run(this));
  }

  /**
   * Add a function to the task group
   * @param func The task function to add to the task set
   */
  public and(func: TaskFunction) {
    this.andIf(true, func);
    return this;
  }

  /**
   * Add a function to the task group that will be run if the expression evaluates as truthy
   * @param expression A boolean or a function that evaluates to a boolean
   * @param func The task function to add to the task set
   */
  public andIf(expression: any, func: TaskFunction) {
    const task: TaskClass = new TaskClass({ expression, func });
    this.tasks.push(task);
    return this;
  }

  /**
   * Called by parent taskRunner. Evaluates TaskSet expression, and performs tasks if truthy
   * @param nightmare
   * @param update
   */
  private run(obj: this) {
    const func = async (
      row: Airtable.RecordData,
      nightmare: Nightmare,
      update: UpdateFunction
    ): Promise<void> => {
      let expressionValue: boolean;

      try {
        expressionValue = !!this.expression(row);
      } catch (e) {
        // handle TaskSet expression evaluation error as falsey
        expressionValue = false;
      }

      if (!expressionValue) {
        return;
      }

      const proms: Promise<void>[] = [];
      for (let task of this.tasks) {
        try {
          proms.push(task.run(row, nightmare, update));
        } catch (e) {
          // do nothing if task fails
        }
      }
      // resolve promise when all tasks in set have completed
      await Promise.all(proms);
    };
    func.bind(obj);
    return func;
  }
}
