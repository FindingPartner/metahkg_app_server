"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const connect = (url) => {
    return mongoose_1.default.connect(url, config_1.default.db.options);
};
exports.connect = connect;
if (require.main === module) {
    app_1.default.listen(config_1.default.port);
    (0, exports.connect)(config_1.default.db.prod);
    console.log('connected?');
    mongoose_1.default.connection.on('error', console.log);
}
//# sourceMappingURL=server.js.map