// export const validate = (schema) => {

//     return (req, res, next) => {

//         console.log("=================================");
//         console.log("Incoming Body =", req.body);

//         const { error } = schema.validate(

//             req.body,

//             {

//                 abortEarly: false

//             }

//         );

//         if (error) {

//             console.log("Validation Error =", error.details);

//             return res.status(400).json({

//                 success: false,

//                 message: "Validation Error",

//                 errors: error.details.map(

//                     err => err.message

//                 )

//             });

//         }

//         next();

//     };

// };


export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            console.log("VALIDATION MIDDLEWARE");
            console.log("REQUEST BODY =", req.body);

            // Make sure the passed schema is actually a Joi schema
            if (!schema || typeof schema.validate !== "function") {
                console.error("INVALID VALIDATION SCHEMA =", schema);

                return res.status(500).json({
                    success: false,
                    message: "Validation schema is not configured correctly"
                });
            }

            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                allowUnknown: false,
                stripUnknown: false
            });

            if (error) {
                console.error(
                    "VALIDATION ERROR =",
                    error.details.map((detail) => detail.message)
                );

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.details.map((detail) => ({
                        field: detail.path.join("."),
                        message: detail.message
                    }))
                });
            }

            // Use Joi's validated/converted value
            req.body = value;

            next();
        } catch (error) {
            console.error("VALIDATION MIDDLEWARE ERROR =", error);

            return res.status(500).json({
                success: false,
                message: "Validation middleware error",
                error: error.message
            });
        }
    };
};