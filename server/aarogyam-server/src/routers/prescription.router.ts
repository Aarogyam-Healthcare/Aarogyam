import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import * as prescriptionController from "../controllers/prescription.controller";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router: Router = Router();

router.use(verifyJWT);

router.get(
  "/:id",
  verifyRole([Role.DOCTOR, Role.PATIENT]),
  prescriptionController.getAllPrescriptionById
);

router.get(
  "",
  verifyRole([Role.DOCTOR]),
  prescriptionController.getAllPrescription
);

router.patch(
  "/:id",
  verifyRole([Role.DOCTOR]),
  prescriptionController.updatePrescription
);

router.post(
  "",
  verifyRole([Role.DOCTOR]),
  prescriptionController.createPrescription
);

router.delete(
  "/:id",
  verifyRole([Role.DOCTOR]),
  prescriptionController.deletePrescription
);

export default router;
