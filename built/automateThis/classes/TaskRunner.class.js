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
const TaskSet_class_1 = require("./TaskSet.class");
class default_1 {
    constructor(nightmareGenerator, airtableClass) {
        this.taskSets = [];
        this.nightmareGenerator = nightmareGenerator;
        this.airtableClass = airtableClass;
    }
    /**
     * A private method that is passed to a new TaskRunner so that it can add its own private `run` method to the queue
     * @param run The TaskSet run function that will be added to the taskSets queue
     */
    addTaskSetRunner(run) {
        this.taskSets.push(run);
    }
    /**
     * Creates a new TaskSet and adds the passed function to the set
     * @param func The task function to add to the task set
     */
    do(func) {
        return this.doIf(true, func);
    }
    /**
     * Create a new TaskSet that will be executed if the expression is evaluated as truthy
     * @param expression A boolean or a function that evaluates to a boolean
     * @param func The task function to add to the task set
     */
    doIf(expression, func) {
        // yes... this feels very dirty
        const taskSet = new TaskSet_class_1.default(expression, this, this.addTaskSetRunner);
        taskSet.and(func);
        return taskSet;
    }
    /**
     * Run the queued TaskSets
     * @param rows
     */
    run(rows) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let taskSet of this.taskSets) {
                for (let row of rows) {
                    yield taskSet(row.getFields(), this.nightmareGenerator(), row.getUpdate(row));
                }
            }
            this.airtableClass.updateAll(rows);
        });
    }
}
exports.default = default_1;
