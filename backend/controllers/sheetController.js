import Metadata from "../models/tableMetadataModel.js";
import TableModel from "../models/sheetDataModel.js";

let activeCollection = "defaultCollection";

export const setCollection = async (req, res) => {
    try {
        const { collection } = req.body;
        if (!collection) {
            return res.status(400).json({ success: false, message: "Collection name is required" });
        }
        activeCollection = collection;
        res.json({ success: true, message: `Active collection set to ${activeCollection}` });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error setting collection" });
    }
};

export const addSheet = async (req, res) => {
    try {
        const { sheetName } = req.body;
        if (!sheetName) {
            return res.status(400).json({ success: false, message: "Sheet name is required" });
        }

        let metadata = await Metadata.findOne();
        if (!metadata) {
            metadata = new Metadata({ sheetNames: [sheetName] });
        } else if (metadata.sheetNames.includes(sheetName)) {
            return res.status(400).json({ success: false, message: "Sheet already exists" });
        } else {
            metadata.sheetNames.push(sheetName);
        }

        await metadata.save();
        res.json({ success: true, message: "Sheet added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error adding sheet" });
    }
};

export const getSheets = async (req, res) => {
    try {
        const metadata = await Metadata.findOne();
        const sheets = metadata ? metadata.sheetNames : [];
        res.json({ success: true, sheets });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error fetching sheets" });
    }
};

export const getTable = async (req, res) => {
    try {
        const table = await TableModel.findOne({ collectionName: activeCollection });
        if (!table) {
            return res.json({ 
                success: true, 
                metadata: { rows: 5, columns: 5 }, 
                data: [] 
            });
        }
        res.json({ 
            success: true,
            metadata: { rows: table.rows, columns: table.columns }, 
            data: table.data 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error fetching table data" });
    }
};

export const saveTable = async (req, res) => {
    try {
        const { rows, columns, data } = req.body;
        if (!rows || !columns || !data) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        await TableModel.findOneAndUpdate(
            { collectionName: activeCollection },
            { rows, columns, data },
            { upsert: true, new: true }
        );
        res.json({ success: true, message: "Table data saved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error saving table data" });
    }
};

export const deleteSheet = async (req, res) => {
    try {
        const { sheetName } = req.body;
        if (!sheetName) {
            return res.status(400).json({ success: false, message: "Sheet name is required" });
        }

        // Update metadata
        const metadata = await Metadata.findOne();
        if (metadata) {
            metadata.sheetNames = metadata.sheetNames.filter(name => name !== sheetName);
            await metadata.save();
        }

        // Delete associated table data
        const deleteResult = await TableModel.deleteOne({ collectionName: sheetName });
        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Sheet not found" });
        }

        res.json({ success: true, message: `Sheet "${sheetName}" deleted successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};
