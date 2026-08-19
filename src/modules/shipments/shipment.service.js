import * as shipmentRepository from './shipment.repository';

export const createShipment = async (data) => {
  const existingShipment = await shipmentRepository.findShipmentByOrderId(data.orderId);
  if (existingShipment) {
    throw new Error('Shipment record already exists for this order.');
  }
  return await shipmentRepository.createShipment(data);
};

export const updateShipmentStatus = async(orderId,updateDate)=>{
    const shipment = await shipmentRepository.findShipmentByOrderId(orderId)
    if (!shipment) {
    throw new Error('Shipment record not found for this order.');
  }
  if(updateDate.status === "Deliverd" && !updateData.deliverdAt){
    updateData.deliveredAt = new Date();
  }

 return await shipmentRepository.updateShipmentByOrderId(orderId, updateData)
}

export const getShipmentByOrder = async(orderId) =>{
    const shipment = await shipmentRepository.findShipmentByOrderId(orderID)
    if (!shipment) {
    throw new Error('Shipment record not found.');
  }
  return shipment;
}