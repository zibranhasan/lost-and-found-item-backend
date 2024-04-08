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
exports.claimController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const claim_service_1 = require("./claim.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const createClaim = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { foundItemId, distinguishingFeatures, lostDate } = req.body;
        console.log("user in claim", user);
        // Create the claim using the provided data
        const claim = yield claim_service_1.ClaimServices.createClaim({
            email: user.email,
            foundItemId,
            distinguishingFeatures,
            lostDate,
        });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.CREATED,
            success: true,
            message: "Claim created successfully",
            data: claim,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllClaimFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield claim_service_1.ClaimServices.getClaims(req, res);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Claims retrieved successfully!",
        data: result,
    });
}));
const updateClaimStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const claimId = req.params.claimId;
        const { status } = req.body;
        // Update the claim status
        const updatedClaim = yield claim_service_1.ClaimServices.updateClaimStatus(claimId, status);
        // Send success response with the updated claim data
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: "Claim updated successfully",
            data: updatedClaim,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.claimController = {
    createClaim,
    getAllClaimFromDB,
    updateClaimStatus,
};
