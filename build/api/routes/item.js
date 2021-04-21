"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_1 = __importDefault(require("../controllers/item"));
const router = express_1.Router();
router.post('/:item/add', item_1.default.addItem);
router.post('/:item/sell', item_1.default.sellItem);
router.get('/:item/quantity', item_1.default.getItem);
exports.default = router;
