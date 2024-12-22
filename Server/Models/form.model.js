import mongoose from "mongoose";

const rakeSchema = new mongoose.Schema({
    rakeNo: {
        type: String,
        required: true,
        unique: true,
    },
    rakeArrivalTime: {
        type: String,
        required: true,
    },
    wagons: { type: String, required: true },
    companyName: {
        type: String,
        required: true,
    },
    arrivalDate: {
        type: Date,
        required: true,
    },
    siding: {
        type: String,
        required: true,
    },
    placementDateTime: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Rake = mongoose.model("Rake", rakeSchema);
export default Rake;
