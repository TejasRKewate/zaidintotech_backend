import WalkInOrder from './walkinorder.model.js'
import walkInInvoice from '../walkinInvoice/walkininvoice.model.js'

// GET /api/orders (supports filtering by date and status)
export const getOrders = async (req, res) => {
    try {
        const { status, date } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            filter.createdAt = { $gte: start, $lte: end };
        }

        const orders = await WalkInOrder.find(filter)
            .populate("customer", "name phone email")
            .populate("receptionistId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
    try {
        const order = await WalkInOrder.findById(req.params.id)
            .populate("customer")
            .populate("receptionistId", "name email");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST /api/orders (Draft or direct order creation)
export const createOrder = async (req, res) => {
    try {
        const { customerId, receptionistId, items, discountTotal = 0, status = "pending_payment" } = req.body;

        let subtotal = 0;
        let taxTotal = 0;

        const processedItems = items.map((item) => {
            const lineSubtotal = item.unitPrice * item.quantity;
            const lineTax = (lineSubtotal * (item.taxRate || 0)) / 100;
            const lineTotal = lineSubtotal + lineTax - (item.discount || 0);

            subtotal += lineSubtotal;
            taxTotal += lineTax;

            return { ...item, taxAmount: lineTax, total: lineTotal };
        });

        const grandTotal = subtotal + taxTotal - discountTotal;
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

        const newOrder = new WalkInOrder({
            orderNumber,
            customer: customerId,
            receptionistId,
            items: processedItems,
            subtotal,
            discountTotal,
            taxTotal,
            grandTotal,
            status,
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order created", data: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /api/orders/:id (Cascades deletion or cancels linked invoices)
export const deleteOrder = async (req, res) => {
    try {
        const order = await WalkInOrder.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Also remove associated invoices
        await Invoice.deleteMany({ order: req.params.id });

        res.status(200).json({ success: true, message: "Order and linked invoices deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};