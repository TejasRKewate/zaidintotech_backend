import * as repairRepository from "./repair.repository.js"

// Create Repair Request
export const createRepair = async (repairData) => {
  const {
    user,
    product,
    issueDescription,
    estimatedCompletionDate,
    repairCost,
    technicianName,
    remarks,
  } = repairData;

  const repair = await repairRepository.createRepair({
    user,
    product,
    issueDescription,
    estimatedCompletionDate,
    repairCost: repairCost || 0,
    technicianName: technicianName || "",
    remarks: remarks || "",
  });

  return repair;
};

// Get Repair By Id
export const getRepairById = async (id) => {
  const repair = await repairRepository.getRepairById(id);

  if (!repair) {
    throw new Error("Repair request not found.");
  }

  return repair;
};

// Get All Repairs
export const getAllRepairs = async () => {
  return await repairRepository.getAllRepairs();
};

// Get Repairs By User
export const getRepairsByUser = async (userId) => {
  return await repairRepository.getRepairsByUser(userId);
};

// Get Repairs By Product
export const getRepairsByProduct = async (productId) => {
  return await repairRepository.getRepairsByProduct(productId);
};

// Update Repair
export const updateRepair = async (id, data) => {
  const repair = await repairRepository.updateRepair(id, data);
  if (!repair) {
    throw new Error("Repair request not found."); // <--- Triggered here
  }

  return repair;
};

// Update Repair Status
export const updateRepairStatus = async (id, status) => {
  const repair = await repairRepository.updateRepairStatus(id, status);

  if (!repair) {
    throw new Error("Repair request not found.");
  }

  return repair;
};

// Mark Repair Delivered
export const markDelivered = async (id) => {
  const repair = await repairRepository.markDelivered(id);

  if (!repair) {
    throw new Error("Repair request not found.");
  }

  return repair;
};

// Delete Repair
export const deleteRepair = async (id) => {
  const repair = await repairRepository.deleteRepair(id);

  if (!repair) {
    throw new Error("Repair request not found.");
  }

  return repair;
};



// export {
//   createRepair,
//   getRepairById,
//   getAllRepairs,
//   getRepairsByUser,
//   getRepairsByProduct,
//   updateRepair,
//   updateRepairStatus,
//   markDelivered,
//   deleteRepair,
// };