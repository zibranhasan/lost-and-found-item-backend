"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    let errorMessage = "Something went wrong!";
    let errorDetails = err;
    // Check if it's a Zod validation error
    if (err.issues) {
        statusCode = http_status_codes_1.default.BAD_REQUEST;
        errorMessage = err.issues.map((issue) => issue.message).join(". ");
        errorDetails = { issues: err.issues };
    }
    else if (err.name === "UnauthorizedError") {
        statusCode = http_status_codes_1.default.UNAUTHORIZED;
        errorMessage = "Unauthorized";
        errorDetails = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message: errorMessage,
        errorDetails: errorDetails,
    });
};
exports.default = globalErrorHandler;
