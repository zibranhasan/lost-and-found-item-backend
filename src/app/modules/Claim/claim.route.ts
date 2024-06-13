import express from "express";

import auth from "../../middlewares/auth";
import { claimController } from "./claim.controller";
import validateRequest from "../../middlewares/validateRequest";
import { claimValidation } from "./claim.validation";

const router = express.Router();

router.post(
  "/claims",
  auth(),
  validateRequest(claimValidation.createClaimSchema),
  claimController.createClaim
);
router.get("/claims", auth(), claimController.getAllClaimFromDB);
router.put(
  "/claims/:claimId",
  auth(),
  validateRequest(claimValidation.updateClaimStatusSchema),
  claimController.updateClaimStatus
);
router.get("/myClaims", auth(), claimController.getMyClaims);

export const ClaimRoutes = router;
