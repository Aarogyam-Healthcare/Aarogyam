import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import * as appointmentController from "../controllers/appointment.controller";
import { verifyRole } from "../middlewares/rbac.middleware";
import { Role } from "@prisma/client";

const router: Router = Router();

router.use(verifyJWT);

router.get(
  "",
  verifyRole([Role.DOCTOR, Role.PATIENT]),
  appointmentController.getAllAppointment
);

router.patch(
  "",
  verifyRole([Role.DOCTOR, Role.PATIENT]),
  appointmentController.updateAppointment
);

router.post(
  "",
  verifyRole([Role.PATIENT]),
  appointmentController.createAppointment
);

export default router;
