import Joi from "joi";


// Manual Attendance Validation manualAttendanceSchema



export const manualAttendanceValidation = Joi.object({
    body: Joi.object({
        employeeId: Joi.string().required(),
        status: Joi.string().valid('present', 'absent', 'leave').required(),
        remark: Joi.string().optional(),
    }),
});

// export const manualAttendanceValidation = Joi.object({

//     user:Joi.string()
//         .required()
//         .messages({
//             "any.required":
//             "Employee is required"
//         }),


//     status:Joi.string()
//         .valid(
//             "PRESENT",
//             "ABSENT",
//             "HALF_DAY",
//             "LEAVE"
//         )
//         .required(),


//     remark:Joi.string()
//         .allow("")

// });


// export const manualAttendanceValidation = {
//   body: Joi.object().keys({
//     user: Joi.string()
//       .required()
//       .regex(/^[0-9a-fA-F]{24}$/)
//       .messages({ "string.pattern.base": "Invalid User ID format" }),
//     employeeId: Joi.string().required(),
//     date: Joi.date().required(),
//     attendanceMode: Joi.string()
//       .valid("MANUAL", "BIOMETRIC")
//       .default("MANUAL"),
//     status: Joi.string()
//       .valid("PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "LATE")
//       .default("PRESENT"),
//     checkIn: Joi.date().optional().allow(null),
//     checkOut: Joi.date().optional().allow(null),
//     workingHours: Joi.number().min(0).optional(),
//     lateMinutes: Joi.number().min(0).optional(),
//     overtime: Joi.number().min(0).optional(),
//     remark: Joi.string().allow("").optional(),
//     shift: Joi.string().optional().allow(null).regex(/^[0-9a-fA-F]{24}$/)
//   }).unknown(true) // <--- .unknown(true) allows extra payload fields without throwing errors
// };


// Biometric Validation

export const biometricAttendanceValidation = Joi.object({

    biometricId: Joi.string()
        .required()
        .messages({
            "any.required":
                "Biometric ID required"
        }),


    punchTime: Joi.date()
        .required()

});





// Checkout Validation

export const checkoutValidation = Joi.object({

    user: Joi.string()
        .required(),
    checkoutTime: Joi.date().required(),
});