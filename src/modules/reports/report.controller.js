import {
  generateSalesReport,
  generateStockReport,
  generateUserReport,
} from './report.service.js';
import ApiResponse from '../../common/utils/apiResponse.js';

export const getSalesReport = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const report = await generateSalesReport(start, end);
    return res.status(200).json(
      new ApiResponse(200, report, 'Sales report generated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getStockReport = async (req, res, next) => {
  try {
    const report = await generateStockReport();
    return res.status(200).json(
      new ApiResponse(200, report, 'Stock report generated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getUserReport = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const report = await generateUserReport(start, end);
    return res.status(200).json(
      new ApiResponse(200, report, 'User report generated successfully')
    );
  } catch (error) {
    next(error);
  }
};