import Airtable = require("Airtable");
import Nightmare = require("nightmare");

export type TaskFunction = {
  (row: Airtable.RecordData, nightmare: Nightmare, update: any): Promise<void>;
};

export type TaskExpression = {
  (row: Airtable.RecordData): boolean;
};

export type Task = {
  expression: TaskExpression;
  func: TaskFunction;
};

export type RunTaskSet = {
  (row: Airtable.RecordData, nightmare: Nightmare, update: any): Promise<void>;
};

export type UpdateFunction = {
  (newRowData: Airtable.RecordData): void;
};

export type LogicOperator = ">" | "<" | ">=" | "<=" | "=" | "!=";