import express from "express";
import auth from "../../middlewares/auth";
import { claimController } from "./claim.controller";

const router = express.Router();

router.post(
  "/claims",
  auth(),
  // validateRequest(claimValidation.createClaimSchema),
  claimController.createClaim
);

router.get("/claims", auth(), claimController.getAllClaims);

router.put("/claims/:claimId", auth(), claimController.updateClaimStatus);

router.get("/myClaims", auth(), claimController.getMyClaims);

// Delete claim route
router.delete("/claims/:claimId", auth(), claimController.deleteClaim);

export const ClaimRoutes = router;
