import dotenv from "dotenv"
import {validationResult} from "express-validator"
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../../utils/response.js"
import {addTransactionQuery, fetchAllTransactionsQuery, fetchTransactionQuery, updateTransactionQuery, deleteTransactionQuery, fetchOutstandingBalanceForIncomeAndExpenseQuery,fetchYearlyDataQuery,fetchAllYearsDataQuery,fetchTenantsReportDataQuery} from "../model/transactionQuery.js"
import {incrementId, createDynamicUpdateQuery} from "../../helpers/functions.js"
dotenv.config();

export const addTransaction = async(req, res, next) =>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let {event_id, tag, type, item, decided_amount, entered_amount, outstanding_amount, remarks} = req.body;
        tag = tag.toLowerCase();
        type = type.toLowerCase();
        if(tag=='income'){
            if(entered_amount > decided_amount){
                return notFoundResponse(res, '', 'Received amount cannot be greater than the amount due.');
            }
            if(decided_amount != (entered_amount + outstanding_amount)){
                return notFoundResponse(res, '', 'Amount due should be equal to the sum of received and outstanding amount.');
            }
        }
        const [data]= await addTransactionQuery([event_id, tag, type, item, decided_amount, entered_amount, outstanding_amount, remarks]);
        return successResponse(res, data, 'Transaction successfully registered');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchAllTransactionsBasedOnEvent = async (req, res, next) => {
    try {
        const {event_id} = req.body;
        const [data] = await fetchAllTransactionsQuery([event_id]);
        if (data.length==0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'All transactions fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchTransactionsBasedOnEvent = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {transaction_id, event_id} = req.body;
        const [data] = await fetchTransactionQuery([transaction_id, event_id]);
        if (data.length==0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, 'Transaction data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const updateTransaction = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const req_data = req.body; 
        const transaction_id = req.params.id;
        const event_id = req.params.event_id;
        const condition = {
            _id: transaction_id,
            event_id:event_id
        };
        const [data] = await fetchTransactionQuery([transaction_id, event_id]);
        if (data.length==0) {
            return errorResponse(res, '', 'Data not found.');
        }
        const query_values = await createDynamicUpdateQuery("transactions", condition, req_data);
        await updateTransactionQuery(query_values.updateQuery, query_values.updateValues)
        return successResponse(res,"",'Transaction updated successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const deleteTransaction = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const transaction_id = req.params.id;
        const event_id = req.params.event_id;
        const [data] = await fetchTransactionQuery([transaction_id, event_id]);
        if (data.length==0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        await deleteTransactionQuery([transaction_id, event_id]);
        return successResponse(res, "", 'Transaction deleted successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchYearlyData = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {year,type, event_id} = req.body;
        const [data] = await fetchYearlyDataQuery([year,type, event_id]);
        if (data.length==0) {
            return notFoundResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data[0], 'Yearly data fetched successfully');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}

export const fetchAllYearsData = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "");
        }
        const { flag, type, event_id } = req.body;
        const [data] = await fetchAllYearsDataQuery(event_id, type, flag);
        if (data.length === 0) {
            return notFoundResponse(res, "", "Data not found.");
        }
        return successResponse(res, data, 'Fetch all year data successful');
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
};


export const fetchOutstandingBalanceForIncomeAndExpense = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {flag,type,event_id} = req.body;
        const [data] = await fetchOutstandingBalanceForIncomeAndExpenseQuery(event_id,type, flag);
        if (data.length==0) {
            return errorResponse(res, '', 'Data not found.');
        }
        return successResponse(res, data, `${flag + "ly"} ${type} outstanding fetched successfully.`);
    } catch (error) {
      return internalServerErrorResponse(res, error);
    }
  };

export const fetchTenantsReportData= async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return errorResponse(res, errors.array(), "");
        }
        const { event_id,from_date,to_date} = req.body;
        const [data] = await fetchTenantsReportDataQuery(event_id,from_date,to_date);
        if (data.length == 0) {
        return notFoundResponse(res, "", "Data not found.");
        }
        return await successResponse(res, data, "Tenants data fetched successfully");
    } catch (error) {
        return internalServerErrorResponse(res, error);
    }
}