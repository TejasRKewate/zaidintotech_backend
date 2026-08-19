import {

    createManualAttendance,

    createBiometricAttendance,

    checkoutAttendance,

    getAllAttendance

}
    from "./attendance.service.js";


import Employee from '../users/user.model.js';
import Attendance from './attendance.model.js';

// ==================================================
// Manual Attendance
// ==================================================


// src/modules/attendence/attendance.controller.js

export const createManualAttendance22 = async (req, res, next) => {
    try {
        let { userId, date, status, checkIn, checkOut, remarks } = req.body;

        // Define allowed status values
        const ALLOWED_STATUSES = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "LATE"];

        // Ensure status is provided and normalized to uppercase
        if (!status || typeof status !== "string") {
            throw new Error("Status is required");
        }

        const normalizedStatus = status.toUpperCase().trim();

        if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
            throw new Error(`Invalid status value. Allowed values are: ${ALLOWED_STATUSES.join(", ")}`);
        }

        // Use normalizedStatus for the database operation
        // ... rest of your attendance creation logic
    } catch (error) {
        next(error);
    }
};



export const manualAttendance = async (req, res) => {

    try {


        const attendance =
            await createManualAttendance(
                req.body
            );



        res.status(201).json({

            success: true,

            message:
                "Manual attendance marked successfully",

            data: attendance

        });


    }
    catch (error) {


        res.status(400).json({

            success: false,

            message: error.message

        });


    }

};





// ==================================================
// Biometric Attendance
// ==================================================

export const biometricAttendance = async (req, res) => {

    try {


        const attendance =
            await createBiometricAttendance(
                req.body
            );



        res.status(201).json({

            success: true,

            message:
                "Biometric attendance received",

            data: attendance

        });


    }
    catch (error) {


        res.status(400).json({

            success: false,

            message: error.message

        });


    }

};






// ==================================================
// Check Out
// ==================================================

export const checkout = async (req, res) => {


    try {


        const attendance =
            await checkoutAttendance(
                req.body
            );



        res.json({

            success: true,

            message:
                "Checkout successful",

            data: attendance

        });


    }
    catch (error) {


        res.status(400).json({

            success: false,

            message: error.message

        });


    }


};






// ==================================================
// Get Attendance List
// ==================================================
export const getAttendance = async (req, res) => {


    try {


        let filter = {};


        // Admin can see all attendance

        if (
            [
                "SUPER_ADMIN",
                "ADMIN",

            ]
                .includes(req.user.role)
        ) {

            filter = {};

        }


        // Employee can see own attendance

        else {


            filter = {
                user: req.user._id
            };


        }



        const attendance =
            await getAllAttendance(filter);



        res.json({

            success: true,

            data: attendance

        });


    }
    catch (error) {


        res.status(500).json({

            success: false,

            message: error.message

        });


    }


};