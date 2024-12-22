import Rake from "../Models/form.model.js";

export const addRake = async (req, res) => {
    try {
        const { rakeNo, rakeArrivalTime, wagons, companyName, arrivalDate, siding, placementDateTime } = req.body;

        const existingRake = await Rake.findOne({ rakeNo });

        if (existingRake) {
            return res.status(400).json({ message: "Rake with this number already exists" });
        }

        const rake = await Rake.create({
            rakeNo,
            rakeArrivalTime,
            wagons,
            companyName,
            arrivalDate,
            siding,
            placementDateTime
        });

        res.status(201).json({
            success: true,
            message: "Rake added successfully",
            rake,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};


export const getAllRakes = async (req, res) => {
    try {
        const rakes = await Rake.find();

        if (!rakes || rakes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No rakes found",
            });
        }

        res.status(200).json({
            success: true,
            rakes,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
