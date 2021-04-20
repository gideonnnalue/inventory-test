"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_1 = __importDefault(require("./item"));
const router = express_1.Router();
// router.use('/item', itemRoute);
router.use('/', item_1.default);
exports.default = router;
