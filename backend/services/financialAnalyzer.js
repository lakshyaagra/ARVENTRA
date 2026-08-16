const { calculateCreditHealthScore,getCreditHealthStatus } = require("./creditHealthService");

const financialAnalyzer = ({
    income = [],
    expenses = [],
    goals = [],
    loans = [],
    assets = []
}) => {
    /* ================================================================
       INCOME
    ================================================================ */
    const totalIncome = income.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
    );
    /* ================================================================
       EXPENSES
    ================================================================ */
    const totalExpenses = expenses.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
    );
    const monthlySavings = totalIncome - totalExpenses;
    const savingsRate =
        totalIncome === 0
            ? 0
            : (monthlySavings / totalIncome) * 100;

    /* ================================================================
       EXPENSE CATEGORY ANALYSIS
    ================================================================ */

    const expenseByCategory = {};
    expenses.forEach((expense) => {
        const category = expense.category || "other";
        const amount = Number(expense.amount || 0);
        expenseByCategory[category] =
            (expenseByCategory[category] || 0) + amount;
    });
    const expenseCategoryDetails = Object.entries(
        expenseByCategory
    )
        .map(([category, amount]) => {
            const percentage =
                totalExpenses === 0
                    ? 0
                    : (amount / totalExpenses) * 100;
            return {
                category,
                amount,
                percentage: Number(percentage.toFixed(2))
            };
        })
        .sort((a, b) => b.amount - a.amount);

    const largestExpenseCategories =
        expenseCategoryDetails.slice(0, 3);


    /* ================================================================
       PAYMENT METHOD ANALYSIS
    ================================================================ */
    const expenseByPaymentMethod = {};
    expenses.forEach((expense) => {
        const paymentMethod = expense.paymentMethod || "other";
        const amount = Number(expense.amount || 0);
        
        expenseByPaymentMethod[paymentMethod] =
            (expenseByPaymentMethod[paymentMethod] || 0) +
            amount;
    });

    const paymentMethodDetails =
        Object.entries(expenseByPaymentMethod)
            .map(([paymentMethod, amount]) => ({
                paymentMethod,
                amount
            }))
            .sort((a, b) => b.amount - a.amount);

    /* ================================================================
       GOALS
    ================================================================ */
    const totalGoalAmount = goals.reduce(
        (sum, item) =>
            sum + Number(item.targetAmount || 0),
        0
    );

    const totalCurrentGoalAmount = goals.reduce(
        (sum, item) =>
            sum + Number(item.currentAmount || 0),
        0
    );

    const goalProgress =
        totalGoalAmount === 0
            ? 0
            : (totalCurrentGoalAmount / totalGoalAmount) * 100;

    const goalDetails = goals.map((goal) => {
        const target=
            Number(goal.targetAmount || 0);
        const current =
            Number(goal.currentAmount || 0);

        const remaining =
            Math.max(target - current, 0);

        const progress =
            target === 0
                ? 0
                : (current / target) * 100;
        return {
            goalName: goal.goalName,
            targetAmount: target,
            currentAmount: current,
            remainingAmount: remaining,
            progress: Number(progress.toFixed(2)),
            deadline: goal.deadline || null,
            status: goal.status || "active",
            priority: goal.priority || "normal"
        };
    });

    /* ================================================================
       LOANS
    ================================================================ */
    const activeLoans = loans.filter(
        (loan) => loan.status === "active"
    );
    const totalLoanAmount = activeLoans.reduce(
        (sum, loan) =>
            sum + Number(loan.outstandingAmount || 0),
        0
    );
    const totalMonthlyEMI = activeLoans.reduce(
        (sum, loan) =>
            sum + Number(loan.emiAmount || 0),
        0
    );
    const activeLoanCount = activeLoans.length;
    const emiToIncomeRatio =
        totalIncome === 0
            ? 0
            : (totalMonthlyEMI / totalIncome) * 100;

    const debtToIncomeRatio =
        totalIncome > 0
            ? Number(
                (totalMonthlyEMI / totalIncome).toFixed(2)
            )
            : 0;

    const loanDetails = activeLoans
        .map((loan) => ({
            loanName: loan.loanName,
            lender: loan.lender,
            loanType: loan.loanType,
            principalAmount:
                Number(loan.principalAmount || 0),
            outstandingAmount:
                Number(loan.outstandingAmount || 0),
            interestRate:
                Number(loan.interestRate || 0),
            loanTerm:
                Number(loan.loanTerm || 0),
            emiAmount:
                Number(loan.emiAmount || 0),
            nextDueDate:
                loan.nextDueDate || null,
            status:
                loan.status,
            notes:
                loan.notes || ""
        }))
        .sort(
            (a, b) =>
                b.interestRate - a.interestRate
        );

    /* ================================================================
       LOAN PRIORITY ANALYSIS
    ================================================================ */
    const loanPriority = loanDetails.map(
        (loan, index) => ({
            priorityRank: index + 1,
            loanName: loan.loanName,
            interestRate: loan.interestRate,
            outstandingAmount:
                loan.outstandingAmount,
            emiAmount:
                loan.emiAmount,
            reason:
                index === 0
                    ? "Highest interest rate"
                    : "Lower priority based on interest rate"
        })
    );

    /* ================================================================
       ASSETS
    ================================================================ */
    const totalAssetValue = assets.reduce(
        (sum, item) =>
            sum + Number(item.currentValue || 0),
        0
    );

    const assetLoanRatio = totalLoanAmount > 0
            ? Number(
                (totalAssetValue / totalLoanAmount).toFixed(2)
            )
            : null;

    /* ================================================================
       FINANCIAL HEALTH
    ================================================================ */
    const financialHealth =
        calculateCreditHealthScore({
            savingsRate,
            debtToIncomeRatio,
            assetLoanRatio,
            activeLoans: activeLoanCount
        });

    const healthStatus = getCreditHealthStatus(financialHealth);

    /* ================================================================
       RETURN ANALYSIS
    ================================================================ */

    return {
        /* Income */
        totalIncome,

        /* Expenses */
        totalExpenses,
        monthlySavings,
        savingsRate,
        expenseByCategory,
        expenseCategoryDetails,
        largestExpenseCategories,
        expenseByPaymentMethod,
        paymentMethodDetails,

        /* Goals */
        totalGoalAmount,
        totalCurrentGoalAmount,
        goalProgress,
        goalDetails,

        /* Loans */
        totalLoanAmount,
        totalMonthlyEMI,
        activeLoanCount,
        emiToIncomeRatio,
        debtToIncomeRatio,
        loanDetails,
        loanPriority,
        /* Assets */
        totalAssetValue,
        assetLoanRatio,
        /* Financial health */
        financialHealth,
        healthStatus
    };
};
module.exports = financialAnalyzer;