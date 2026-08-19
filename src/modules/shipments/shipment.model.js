import mongoose from 'mongoose'

const shipmentSchema = new mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        requird:true,
        unique:true
    },
    trackingId:{
        type:String,
        requird:true,
        trim:true
    },
    courierName:{
        type:String,
        required:true,
        trim:true
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed', 'Returned'],
      default: 'Pending',
    },
    estimateDelivery:{
        type:Date
    },
    dispatchedAt:{
        type:Date
    },
    deliverdAt:{
        type:Date
    }
},{
    timestamps:true
})



const Shipment  =  mongoose.model("Shipments" , shipmentSchema)
export default Shipment;