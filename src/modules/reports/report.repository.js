import Order from '../orders/order.model.js';
import Inventory from '../inventory/inventory.model.js';
import User from '../users/user.model.js';

export const getSalesReport = async (startDate, endDate) => {
  return await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        paymentStatus: 'Paid'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalAmount' }
      }
    }
  ]);
};

export const getStockReport = async () => {
  return await Inventory.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalStockQuantity: { $sum: '$quantity' }
      }
    }
  ]);
};

export const getUserAnalyticsReport = async (startDate, endDate) => {
  return await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    {
      $group: {
        _id: '$role',
        totalUsers: { $sum: 1 }
      }
    }
  ]);
};