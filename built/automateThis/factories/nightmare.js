"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nightmare = require("nightmare");
exports.default = () => {
    return new Nightmare({
        show: process.env.MISC_DISPLAY_WINDOW === "T",
        waitTimeout: 20000,
    });
};
