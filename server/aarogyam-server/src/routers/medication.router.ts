import { Router } from "express";
import * as medicationController from "../controllers/medication.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router: Router = Router();

router.use(verifyJWT);

/**
 * Route to create a new medical examination.
 * Only accessible by users with the ADMIN role.
 */
router.post(
  "",
  verifyRole([Role.PATIENT]),
  medicationController.createMedication
);

/**
 * Route to retrieve all medical examinations.
 */
router.get("", verifyRole([Role.PATIENT]), medicationController.getMedication);

/**
 * Route to update a medical examination by ID.
 * Only accessible by users with the ADMIN role.
 */
router.patch(
  "",
  verifyRole([Role.PATIENT]),
  medicationController.updateMedication
);

/**
 * Route to delete a medical examination by ID.
 * Only accessible by users with the ADMIN role.
 */
router.delete(
  "/:id",
  verifyRole([Role.PATIENT]),
  medicationController.deleteMedication
);

router.delete(
  "/:id",
  verifyRole([Role.PATIENT]),
  medicationController.deleteMedicatonTime
);

export default router;
