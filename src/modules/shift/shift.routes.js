import express from "express";

import {
createShift,
getShift,
updateShift,
deleteShift,
getAllShifts
}
from "./shift.controller.js";


const router = express.Router();



router.post(
"/",
createShift
);


router.get(
"/all-shifts",
getAllShifts
);


router.get(
"/:id",
getShift
);


router.put(
"/:id",
updateShift
);


router.delete(
"/:id",
deleteShift
);



export default router;