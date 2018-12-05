"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(record) {
        this.isUpdated = false;
        this.id = record.getId();
        this.fields = record.fields;
    }
    getId() {
        return this.id;
    }
    /**
     * Return a shallow copy of record fields
     */
    getFields() {
        return Object.assign({}, this.fields);
    }
    getUpdate(obj) {
        const func = (newFields) => {
            this.isUpdated = true;
            this.fields = Object.assign({}, this.fields, newFields);
        };
        func.bind(obj);
        return func;
    }
}
exports.default = default_1;
