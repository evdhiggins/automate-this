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
const Task_class_1 = require("./Task.class");
class default_1 {
    constructor(expression, taskRunner, addTaskSetRunner) {
        /**
         * The tasks belonging to this task set
         */
        this.tasks = [];
        if (typeof expression === "boolean") {
            this.expression = () => expression;
        }
        else {
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
    and(func) {
        this.andIf(true, func);
        return this;
    }
    /**
     * Add a function to the task group that will be run if the expression evaluates as truthy
     * @param expression A boolean or a function that evaluates to a boolean
     * @param func The task function to add to the task set
     */
    andIf(expression, func) {
        const task = new Task_class_1.default({ expression, func });
        this.tasks.push(task);
        return this;
    }
    /**
     * Called by parent taskRunner. Evaluates TaskSet expression, and performs tasks if truthy
     * @param nightmare
     * @param update
     */
    run(obj) {
        const func = (row, nightmare, update) => __awaiter(this, void 0, void 0, function* () {
            let expressionValue;
            try {
                expressionValue = !!this.expression(row);
            }
            catch (e) {
                // handle TaskSet expression evaluation error as falsey
                expressionValue = false;
            }
            if (!expressionValue) {
                return;
            }
            const proms = [];
            for (let task of this.tasks) {
                try {
                    proms.push(task.run(row, nightmare, update));
                }
                catch (e) {
                    // do nothing if task fails
                }
            }
            // resolve promise when all tasks in set have completed
            yield Promise.all(proms);
        });
        func.bind(obj);
        return func;
    }
}
exports.default = default_1;
