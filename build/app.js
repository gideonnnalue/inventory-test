"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("./tasks");
const index_1 = __importDefault(require("./api/routes/index"));
dotenv.config();
const app = express_1.default(); // initialize the express server
if (process.env.NODE_ENV === 'development') {
    app.use(morgan_1.default('dev'));
}
// Set security HTTP headers
app.use(helmet_1.default());
// Implement Cors
app.use(cors_1.default());
// Body parser, reading data from body into req.body
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// create a test route
app.get('/', (req, res) => {
    res.send('Api live!');
});
app.use('/', index_1.default);
// to handle 404 errors
app.use((_req, res) => res.status(404).json({ error: 'Page not found' }));
exports.default = app;
