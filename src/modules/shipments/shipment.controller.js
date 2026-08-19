import * as shipmentService from './shipment.service.js';
import ApiResponse from '../../common/utils/apiResponse.js';

export const updateShipment = async (req, res,) => {
  try {
    const { orderId } = req.params;
    const shipment = await shipmentService.updateShipmentStatus(orderId, req.body);
    return res.status(200).json(
      new ApiResponse(200, shipment, 'Shipment details updated successfully')
    );
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        message:"Something went error",
        errorMessage:error
    })
  }
};

export const getShipmentDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const shipment = await shipmentService.getShipmentByOrder(orderId);
    return res.status(200).json(
      new ApiResponse(200, shipment, 'Shipment details retrieved successfully')
    );
  } catch (error) {
   console.log(error)
    return res.status(500).json({
        message:"Something went error",
        errorMessage:error
    })
  }
  
};