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
        const { foundItemId, distinguishingFeatures, lostDate, verificationMethod, verificationDetails, contactInformation, } = req.body;
        const claim = yield claim_service_1.ClaimServices.createClaim({
            email: user.email,
            foundItemId,
            distinguishingFeatures,
            lostDate,
            verificationMethod,
            verificationDetails,
            contactInformation,
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
const getAllClaims = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield claim_service_1.ClaimServices.getAllClaims();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Claims retrieved successfully!",
        data: result,
    });
}));
const updateClaimStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { claimId } = req.params;
    const data = req.body; // Assume that data contains the fields you want to update
    const updatedClaim = yield claim_service_1.ClaimServices.updateClaimFields(claimId, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Claim updated successfully",
        data: updatedClaim,
    });
}));
const getMyClaims = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.user.email;
    const claims = yield claim_service_1.ClaimServices.getMyClaims(userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Claims retrieved successfully!",
        data: claims,
    });
}));
const deleteClaim = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { claimId } = req.params;
    yield claim_service_1.ClaimServices.deleteClaim(claimId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Claim deleted successfully",
        data: [],
    });
}));
exports.claimController = {
    createClaim,
    getAllClaims,
    updateClaimStatus,
    getMyClaims,
    deleteClaim,
};
