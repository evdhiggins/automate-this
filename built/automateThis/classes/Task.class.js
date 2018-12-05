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
class default_1 {
    constructor(task) {
        this.task = task;
        if (typeof task.expression === "boolean") {
            this.task.expression = () => task.expression;
        }
    }
    run(row, nightmare, update) {
        return __awaiter(this, void 0, void 0, function* () {
            let expressionValue;
            try {
                expressionValue = !!this.task.expression(row);
            }
            catch (e) {
                // handle evaluation error as falsey expression
                expressionValue = false;
            }
            if (expressionValue) {
                try {
                    yield this.task.func(row, nightmare, update);
                }
                catch (e) {
                    console.error("\n");
                    console.error("Error occurred performing task:");
                    console.error(e.message);
                }
            }
        });
    }
}
exports.default = default_1;
