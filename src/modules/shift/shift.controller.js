import * as shiftService from "./shift.service.js";



// CREATE

// export const createShift = async(req,res)=>{

// try{

// const shift =
// await shiftService.createShift({
//     ...req.body,
//     createdBy:req.user._id
// });


// res.status(201).json({

// success:true,
// message:"Shift created successfully",
// data:shift

// });


// }catch(error){
// console.log(error.message)
// res.status(400).json({

// success:false,
// message:error.message

// });

// }

// };


export const createShift = async (req, res) => {
  try {
    const newshift = await shiftService.createShift({
      ...req.body,
      
    });

    res.status(201).json({
      success: true,
      message: "Shift created successfully",
      data:  newshift,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//GET ALL SHIFTS
export const getAllShifts = async (req, res) => {
  try {
    const shifts = await shiftService.getAllShifts();
    res.status(200).json({
      success: true,
      message: 'Shifts retrieved successfully',
      data: shifts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve shifts',
    });
  }
};

// GET SINGLE

export const getShift = async(req,res)=>{

try{


const shift =
await shiftService.getShift(
req.params.id
);



res.json({

success:true,
data:shift

});


}catch(error){

res.status(404).json({

success:false,
message:error.message

});

}

};




// UPDATE

export const updateShift = async(req,res)=>{


try{


const shift =
await shiftService.updateShift(
req.params.id,
{
...req.body,
updatedBy:req.user._id
}
);


res.json({

success:true,
data:shift

});


}catch(error){

res.status(400).json({

success:false,
message:error.message

});

}


};




// DELETE

export const deleteShift = async(req,res)=>{


try{


await shiftService.deleteShift(
req.params.id
);



res.json({

success:true,
message:"Shift deleted"

});


}catch(error){

res.status(400).json({

success:false,
message:error.message

});

}


};