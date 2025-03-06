const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
    collectionName: String,
    rows: Number,
    columns: Number,
    data: [
        {
            row: Number,
            col: Number,
            value: String,
        },
    ],
});

const TableModel = mongoose.model("SheetData", tableSchema);
module.exports = TableModel;
