const mongoose = require("mongoose");

const metadataSchema = new mongoose.Schema({
    sheetNames: [String],
});

const Metadata = mongoose.model("TableMetadata", metadataSchema);
module.exports = Metadata;
