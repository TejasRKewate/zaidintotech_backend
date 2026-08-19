import WalkInCustomer from './walkin.model.js'

// GET /api/customers (all or search by phone/name)
export const getCustomers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                ],
            };
        }
        const customers = await WalkInCustomer.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: customers.length, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/customers/:id
export const getCustomerById = async (req, res) => {
    try {
        const customer = await WalkInCustomer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST /api/customers
export const createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;

        const existing = await WalkInCustomer.findOne({ phone });
        if (existing) {
            return res.status(400).json({ success: false, message: "Customer with this phone already exists" });
        }

        const customer = new WalkInCustomer({ name, phone, email, address });
        await customer.save();

        res.status(201).json({ success: true, message: "Customer created", data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
    try {
        const customer = await WalkInCustomer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};