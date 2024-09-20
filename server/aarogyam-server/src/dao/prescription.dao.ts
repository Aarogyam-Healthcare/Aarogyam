import { Medication, Prescription, PrismaClient } from "@prisma/client";
import {
  PrescriptionDTO,
  PrescriptionUpdateDTO,
} from "../types/prescription.dto";

const prescriptionClient = new PrismaClient().prescription;
const medicationClient = new PrismaClient().medication;
const medicationTimeClient = new PrismaClient().medicationTime;

export const createPrescription = async (
  doctorId: number,
  prescriptionData: PrescriptionDTO
): Promise<Prescription> => {
  return prescriptionClient.create({
    data: {
      doctorId,
      patientId: prescriptionData.patientId,
      notes: prescriptionData.notes,
    },
  });
};

export const deletePrescription = async (
  prescriptionId: number
): Promise<void> => {
  await medicationClient.deleteMany({
    where: {
      prescriptionId,
    },
  });

  await medicationTimeClient.deleteMany({
    where: {
      medication: {
        prescriptionId,
      },
    },
  });

  await prescriptionClient.delete({
    where: {
      id: prescriptionId,
    },
  });
};

// export const updatePrescription = async (
//   prescriptionId: number,
//   doctorId: number,
//   prescriptionData: PrescriptionUpdateDTO
// ): Promise<any> => {
//   return prescriptionClient.upsert({
//     where: { id: prescriptionId }, // Using prescription ID to find the record
//     create: {
//       patientId: prescriptionData.patientId,
//       doctorId,
//       notes: prescriptionData.notes,
//       medicines: {
//         create: prescriptionData.medicines.map((medication) => ({
//           patientId: prescriptionData.patientId,
//           name: medication.name,
//           dosage: medication.dosage,
//           frequency: medication.frequency,
//           timesToTake: {
//             create: medication.timesToTake.map((time) => ({
//               time,
//             })),
//           },
//           source: medication.source,
//         })),
//       },
//     },
//     update: {
//       patientId: prescriptionData.patientId,
//       notes: prescriptionData.notes,
//       medicines: {
//         deleteMany: { prescriptionId }, // Ensure only medicines related to this prescription are deleted
//         create: prescriptionData.medicines.map((medication) => ({
//           patientId: prescriptionData.patientId,
//           name: medication.name,
//           dosage: medication.dosage,
//           frequency: medication.frequency,
//           timesToTake: {
//             create: medication.timesToTake.map((time) => ({
//               time,
//             })),
//           },
//           source: medication.source,
//         })),
//       },
//     },
//     include: {
//       medicines: {
//         include: {
//           timesToTake: true,
//         },
//       },
//     },
//   });
// };

export const updatePrescription = async (
  prescriptionId: number,
  doctorId: number,
  prescriptionData: PrescriptionUpdateDTO
): Promise<any> => {
  // Upsert the prescription
  return prescriptionClient.upsert({
    where: { id: prescriptionId },
    create: {
      patient: {
        connect: { id: prescriptionData.patientId },
      },
      doctor: {
        connect: { id: doctorId },
      },
      notes: prescriptionData.notes,
      medicines: {
        create: prescriptionData.medicines.map((medication) => ({
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          timesToTake: {
            create: medication.timesToTake.map((time) => ({
              time: time.time,
            })),
          },
          source: medication.source,
          patient: {
            connect: { id: prescriptionData.patientId },
          },
        })),
      },
    },
    update: {
      patient: {
        connect: { id: prescriptionData.patientId },
      },
      notes: prescriptionData.notes,
      medicines: {
        // First, delete old medicines linked to the prescription
        deleteMany: {
          prescriptionId, // Make sure this matches the FK correctly
        },
        // Then, create new medicines
        create: prescriptionData.medicines.map((medication) => ({
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          timesToTake: {
            create: medication.timesToTake.map((time) => ({
              time: time.time,
            })),
          },
          source: medication.source,
          patient: {
            connect: { id: prescriptionData.patientId },
          },
        })),
      },
    },
    include: {
      medicines: {
        include: {
          timesToTake: true,
        },
      },
    },
  });
};

export const getAll = async (
  prescriptionId: number
): Promise<Prescription[]> => {
  return prescriptionClient.findMany({
    where: {
      id: prescriptionId,
    },
    include: {
      medicines: {
        include: {
          timesToTake: true,
        },
      },
    },
  });
};

export const getByDoctorId = async (
  doctorId: number
): Promise<Prescription[]> => {
  return prescriptionClient.findMany({
    where: {
      doctorId,
    },
  });
};

export const getByPatientId = async (
  patientId: number
): Promise<Prescription[]> => {
  return prescriptionClient.findMany({
    where: {
      patientId,
    },
  });
};

export const findByPrescription = async (
  prescriptionId: number
): Promise<Medication[]> => {
  return medicationClient.findMany({
    where: {
      prescriptionId,
    },
  });
};

export const deleteMedicationTimeByMedication = async (
  medicationId: number
): Promise<any> => {
  return medicationTimeClient.deleteMany({
    where: {
      medicationId,
    },
  });
};

export const deleteMedications = async (medicationId: number): Promise<any> => {
  return medicationClient.delete({
    where: {
      id: medicationId,
    },
  });
};
