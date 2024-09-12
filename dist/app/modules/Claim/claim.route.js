"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const claim_controller_1 = require("./claim.controller");
const router = express_1.default.Router();
router.post("/claims", (0, auth_1.default)(), 
// validateRequest(claimValidation.createClaimSchema),
claim_controller_1.claimController.createClaim);
router.get("/claims", (0, auth_1.default)(), claim_controller_1.claimController.getAllClaims);
router.put("/claims/:claimId", (0, auth_1.default)(), claim_controller_1.claimController.updateClaimStatus);
router.get("/myClaims", (0, auth_1.default)(), claim_controller_1.claimController.getMyClaims);
// Delete claim route
router.delete("/claims/:claimId", (0, auth_1.default)(), claim_controller_1.claimController.deleteClaim);
exports.ClaimRoutes = router;
