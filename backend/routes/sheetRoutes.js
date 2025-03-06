import express from "express";
import { 
    setCollection, addSheet, getSheets, getTable, saveTable, deleteSheet 
} from "../controllers/sheetController.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
});

// API to set active collection
router.post("/setCollection", setCollection);

// API to add new sheet
router.post("/addSheet", addSheet);

// API to get all sheets
router.get("/getSheets", getSheets);

// API to get table data
router.get("/getTable", getTable);

// API to save table data
router.post("/saveTable", saveTable);

// API to delete a sheet
router.delete("/deleteSheet", deleteSheet);

export default router;
