"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const node_cron_1 = __importDefault(require("node-cron"));
const moment_1 = __importDefault(require("moment"));
const models_1 = __importDefault(require("../database/models"));
const { Item } = models_1.default;
node_cron_1.default.schedule('59 23 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    yield Item.destroy({
        where: {
            expiry: {
                [sequelize_1.Op.lt]: moment_1.default().unix(),
            },
        },
    });
    console.log('running a task every minute');
}));
