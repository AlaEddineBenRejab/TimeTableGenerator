const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Period =new Schema(
    {
        Name: { type: String, required: true, minlength: 2, maxlength: 30 },
        holidays : [String]
    }
);

module.exports = mongoose.model("Period", Period, "Period", { strict: false });
