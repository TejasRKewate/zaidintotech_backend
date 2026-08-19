import WalkInCustomer from '../walkinCustomer/walkin.model.js'
import WalkInOrder from '../walkinCustomer/walkinOrder/walkinorder.model.js'
import walkInInvoice from '../walkinCustomer/walkinInvoice/walkininvoice.model.js'

// ==========================================
// 1. QUICK CHECKOUT (Composite Transaction)
// ==========================================
exports.createWalkInSale = async (req, res) => {
    try {
        const {
            customerData,      // { name, phone, email }
            items,             // [{ productId, name, unitPrice, quantity, taxRate, discount }]
            discountTotal = 0, // overall discount
            paymentMethod,     // "CASH" | "UPI" | "SPLIT"
            paymentBreakdown = {}, // { cashAmount, upiAmount, upiTransactionId }
        } = req.body;

        const receptionistId = req.user._id; // Extracted automatically from auth token

        // Step A: Find existing customer by phone or register a new one
        let customer = await WalkInCustomer.findOne({ phone: customerData.phone });
        if (!customer) {
            customer = await WalkInCustomer.create({
                name: customerData.name,
                phone: customerData.phone,
                email: customerData.email || "",
            });
        }

        // Step B: Calculate item sums, taxes, and grand total
        let subtotal = 0;
        let taxTotal = 0;

        const processedItems = (items || []).map((item) => {
            const lineSubtotal = Number(item.unitPrice) * Number(item.quantity);
            const lineTax = (lineSubtotal * (Number(item.taxRate) || 0)) / 100;
            const lineDiscount = Number(item.discount) || 0;
            const lineTotal = lineSubtotal + lineTax - lineDiscount;

            subtotal += lineSubtotal;
            taxTotal += lineTax;

            return {
                productId: item.productId,
                name: item.name,
                sku: item.sku || "",
                unitPrice: Number(item.unitPrice),
                quantity: Number(item.quantity),
                taxRate: Number(item.taxRate) || 0,
                taxAmount: lineTax,
                discount: lineDiscount,
                total: lineTotal,
            };
        });

        const grandTotal = Math.max(0, subtotal + taxTotal - Number(discountTotal));
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${randomSuffix}`;
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${randomSuffix}`;

        // Step C: Save WalkInOrder
        const newOrder = await WalkInOrder.create({
            orderNumber,
            customer: customer._id,
            receptionistId,
            items: processedItems,
            subtotal,
            discountTotal: Number(discountTotal),
            taxTotal,
            grandTotal,
            status: "completed",
        });

        // Step D: Calculate Cash vs UPI breakdown and save Invoice
        let cashPaid = 0;
        let upiPaid = 0;

        if (paymentMethod === "CASH") {
            cashPaid = grandTotal;
        } else if (paymentMethod === "UPI") {
            upiPaid = grandTotal;
        } else if (paymentMethod === "SPLIT") {
            cashPaid = Number(paymentBreakdown.cashAmount) || 0;
            upiPaid = Number(paymentBreakdown.upiAmount) || 0;
        }

        const totalPaid = cashPaid + upiPaid;

        const newInvoice = await walkInInvoice.create({
            invoiceNumber,
            order: newOrder._id,
            customer: customer._id,
            amountDue: grandTotal,
            amountPaid: totalPaid,
            paymentStatus: totalPaid >= grandTotal ? "paid" : "partially_paid",
            paymentDetails: {
                method: paymentMethod,
                cashAmount: cashPaid,
                upiAmount: upiPaid,
                upiTransactionId: paymentBreakdown.upiTransactionId || null,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Checkout completed successfully",
            data: {
                customer,
                order: newOrder,
                invoice: newInvoice,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ==========================================
// 2. GET DASHBOARD STATS (Aggregated)
// ==========================================
export const getTodayPOSStats = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Aggregate today's orders directly from WalkInOrder
        const stats = await WalkInOrder.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                },
            },
            {
                $group: {
                    _id: null,
                    todayOrders: { $sum: 1 },
                    todayRevenue: { $sum: "$grandTotal" },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "pending_payment"] }, 1, 0] },
                    },
                    uniqueCustomers: { $addToSet: "$customer" },
                },
            },
            {
                $project: {
                    _id: 0,
                    todayOrders: 1,
                    todayRevenue: 1,
                    pendingOrders: 1,
                    todayVisitors: { $size: "$uniqueCustomers" },
                },
            },
        ]);

        const result = stats[0] || {
            todayOrders: 0,
            todayRevenue: 0,
            pendingOrders: 0,
            todayVisitors: 0,
        };

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};