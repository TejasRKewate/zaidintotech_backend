import ServiceCatalog from "./serviceCatlog.model.js";

// @desc    Get all service rates
// @route   GET /api/repair-service/get-services
export const getAllServices = async (req, res) => {
    try {
        const services = await ServiceCatalog.find().sort({ category: 1, serviceName: 1 });
        return res.status(200).json({
            success: true,
            services,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch services",
            error: error.message,
        });
    }
};

// @desc    Create a new service rate
// @route   POST /api/repair-service/create-service
export const createService = async (req, res) => {
    try {
        const { serviceName, category, partCost, laborCost, estimatedTime, description } = req.body;

        if (!serviceName || laborCost === undefined) {
            return res.status(400).json({
                success: false,
                message: "Service name and labor cost are required",
            });
        }

        const numPartCost = Number(partCost) || 0;
        const numLaborCost = Number(laborCost) || 0;

        const newService = new ServiceCatalog({
            serviceName: serviceName.trim(),
            category: category || "Hardware Repair",
            partCost: numPartCost,
            laborCost: numLaborCost,
            totalCost: numPartCost + numLaborCost,
            estimatedTime: estimatedTime || "1-2 hours",
            description: description ? description.trim() : "",
        });

        await newService.save();

        return res.status(201).json({
            success: true,
            message: "Service rate created successfully",
            service: newService,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create service rate",
            error: error.message,
        });
    }
};

// @desc    Delete a service rate
// @route   DELETE /api/repair-service/delete-service/:id
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ServiceCatalog.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Service rate not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Service rate deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete service rate",
            error: error.message,
        });
    }
};