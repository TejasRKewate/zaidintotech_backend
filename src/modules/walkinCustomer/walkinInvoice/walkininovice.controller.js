import walkInInvoice from './walkininvoice.model.js'
import walkInOrder from '../walkinOrder/walkinorder.model.js'

// GET /api/invoices (Directory lookup & filters)
export const getInvoices = async (req, res) => {
    try {
        const { paymentStatus, paymentMethod } = req.query;
        let filter = {};

        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (paymentMethod) filter["paymentDetails.method"] = paymentMethod;

        const invoices = await walkInInvoice.find(filter)
            .populate("customer", "name phone email")
            .populate("order", "orderNumber grandTotal status items")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: invoices.length, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/invoices/:id
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await walkInInvoice.findById(req.params.id)
            .populate("customer")
            .populate({
                path: "order",
                populate: { path: "receptionistId", select: "name" },
            });

        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }
        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST /api/invoices
export const createInvoice = async (req, res) => {
    try {
        const { orderId, customerId, paymentMethod, cashAmount = 0, upiAmount = 0, upiTransactionId } = req.body;

        // Use lowercase walkInOrder matching your import
        const order = await walkInOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const cAmt = Number(cashAmount) || 0;
        const uAmt = Number(upiAmount) || 0;

        const totalPaid =
            paymentMethod === "CASH" ? cAmt :
                paymentMethod === "UPI" ? uAmt :
                    paymentMethod === "SPLIT" ? (cAmt + uAmt) : 0;

        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

        const newInvoice = new walkInInvoice({
            invoiceNumber,
            order: orderId,
            customer: customerId || order.customer,
            amountDue: order.grandTotal,
            amountPaid: totalPaid,
            paymentStatus: totalPaid >= order.grandTotal ? "paid" : "partially_paid",
            paymentDetails: {
                method: paymentMethod,
                cashAmount: cAmt,
                upiAmount: uAmt,
                upiTransactionId: upiTransactionId || null,
            },
        });

        await newInvoice.save();

        if (totalPaid >= order.grandTotal) {
            order.status = "completed";
            await order.save();
        }

        res.status(201).json({ success: true, message: "Invoice created", data: newInvoice });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// DELETE /api/invoices/:id
export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await walkInInvoice.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }
        res.status(200).json({ success: true, message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};