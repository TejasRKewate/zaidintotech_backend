import Shipment from './shipment.model'

export const createShipment =  async(shipmentData) =>{
    return await Shipment.create(shipmentData)
}

export const findShipmentByOrderId = async (orderId) => {
  return await Shipment.findOne({ orderId }).populate('orderId');
};

export const updateShipmentByOrderId = async (orderId, updateData) => {
  return await Shipment.findOneAndUpdate(
    { orderId },
    { $set: updateData },
    { new: true, runValidators: true }
  )
}