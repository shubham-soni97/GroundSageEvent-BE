import express, { Router } from 'express';
const app = express()
const router = Router();

import authenticateToken from '../../../middlewares/auth.js';
import { addTransaction, deleteTransaction, fetchAllTransactionsBasedOnEvent, fetchOutstandingBalanceForIncomeAndExpense, fetchTransactionsBasedOnEvent, updateTransaction } from '../controller/transactionController.js';
import {addTransactionVal,updateTransactionVal, fetchTransactionVal, fetchAllTransactionVal, deleteTransactionVal, fetchOutstandingBalanceForIncomeAndExpenseVal} from '../../../utils/validation.js';
router.use(authenticateToken);

app.post('/add-transaction',addTransactionVal, addTransaction);
app.put('/update-transaction/:id/:event_id',updateTransactionVal, updateTransaction);
app.delete('/delete-transaction/:id/:event_id',deleteTransactionVal, deleteTransaction);
app.get('/fetch-transaction',fetchTransactionVal, fetchTransactionsBasedOnEvent);
app.get('/fetch-all-transaction',fetchAllTransactionVal, fetchAllTransactionsBasedOnEvent);
app.get('/fetch-outstanding-balance',fetchOutstandingBalanceForIncomeAndExpenseVal, fetchOutstandingBalanceForIncomeAndExpense);
app.use("/", router);

export default app;