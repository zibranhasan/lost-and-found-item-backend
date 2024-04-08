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
exports.foundItemController = exports.createfoundItem = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const found_Item_service_1 = require("./found-Item.service");
const foundItem_constant_1 = require("./foundItem.constant");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const createfoundItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const bodyData = req.body;
        console.log("body data", bodyData);
        const createdFoundItem = yield found_Item_service_1.FoundItemService.createFoundItem(user, bodyData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.CREATED,
            success: true,
            message: "Found item category created successfully",
            data: createdFoundItem,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createfoundItem = createfoundItem;
const getAllFoundItemFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, foundItem_constant_1.foundItemFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield found_Item_service_1.FoundItemService.getAllFoundItemFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Found items retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
exports.foundItemController = {
    createfoundItem: exports.createfoundItem,
    getAllFoundItemFromDB,
};
