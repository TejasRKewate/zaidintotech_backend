import {
  getSalesReport,
  getStockReport,
  getUserAnalyticsReport,
} from './report.repository.js';

export const generateSalesReport = async (start, end) => {
  const startDate = start ? new Date(start) : new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = end ? new Date(end) : new Date();

  const salesData = await getSalesReport(startDate, endDate);

  return {
    period: { startDate, endDate },
    summary: salesData[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 }
  };
};

export const generateStockReport = async () => {
  return await getStockReport();
};

export const generateUserReport = async (start, end) => {
  const startDate = start ? new Date(start) : new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = end ? new Date(end) : new Date();

  return await getUserAnalyticsReport(startDate, endDate);
};