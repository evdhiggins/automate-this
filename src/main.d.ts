import { TaskFunction } from "./types";

declare class AutomatorClass {
  constructor(options: any);

  public filterRowsBy(columnName: string, value: string | number): AirtableFilterClass;

  /**
   * Create a TaskRunner that will be executed for each row found by the filters
   */
  public forEachRow(): TaskRunnerClass;

  /**
   * Perform all specified tasks
   */
  public run(): Promise<void>;
}

declare class TaskRunnerClass {
  /**
   * Creates a new TaskSet and adds the passed function to the set
   * @param func The task function to add to the task set
   */
  public do(func: TaskFunction): TaskSetClass;

  /**
   * Create a new TaskSet that will be executed if the expression is evaluated as truthy
   * @param expression A boolean or a function that evaluates to a boolean
   * @param func The task function to add to the task set
   */
  public doIf(expression: any, func: TaskFunction): TaskSetClass;
}

declare class TaskSetClass {
  /**
   * Add a function to the task group
   * @param func The task function to add to the task set
   */
  public and(func: TaskFunction): this;

  /**
   * Add a function to the task group that will be run if the expression evaluates as truthy
   * @param expression A boolean or a function that evaluates to a boolean
   * @param func The task function to add to the task set
   */
  public andIf(expression: any, func: TaskFunction): this;

  public then: TaskRunnerClass;
}

declare class AirtableFilterClass {
  /**
   * Add a filter
   */
  public and(columnName: string, value: string | number): this;
}

export = AutomatorClass;
