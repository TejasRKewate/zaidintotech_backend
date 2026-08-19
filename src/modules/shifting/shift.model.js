import  mongoose from 'mongoose'

const shiftSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },  
  gracePeriodMinutes: { type: Number, default: 15 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });


const Shift = mongoose.model('Shift', shiftSchema);
export default Shift