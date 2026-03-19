const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createExpense,
  deleteExpense,
  getExpenses,
  getSummary,
  updateBudgets,
  getInsights,
  sendReport,
} = require('../controllers/expenseController');

// All routes protected by JWT middleware
router.use(auth);

router.get('/',          getExpenses);
router.post('/',         createExpense);
router.delete('/:id',    deleteExpense);
router.get('/summary',   getSummary);
router.post('/insights', getInsights);
router.put('/budgets',   updateBudgets);
router.post('/email',    sendReport);

module.exports = router;
