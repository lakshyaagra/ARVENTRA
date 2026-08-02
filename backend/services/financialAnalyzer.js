const financialAnalyzer=({income=[],expenses=[],goals=[],loans=[],assets=[]})=>{
    const totalIncome=income.reduce(
        (sum,item)=>sum + item.amount,
        0
    );
    const totalExpenses=expenses.reduce(
        (sum,item)=>sum + item.amount,
        0
    );
    const monthlySavings=totalIncome-totalExpenses;
    const savingsRate=totalIncome===0?0:(monthlySavings/totalIncome)*100;
    const totalGoalAmount=goals.reduce(
        (sum,item)=>sum + item.targetAmount,
        0
    );
    const totalCurrentGoalAmount=goals.reduce(
        (sum,item)=>sum + item.currentAmount,
        0
    );
    const goalProgress=totalGoalAmount===0?0:(totalCurrentGoalAmount/totalGoalAmount)*100;
    const totalLoanAmount=loans.reduce(
        (sum,item)=>sum + item.outstandingAmount,
        0
    );
    const totalAssetValue=assets.reduce(
        (sum,item)=>sum + item.currentValue,
        0
    );
    const activeLoanCount=loans.filter(
        loan => loan.status === "active"
    ).length;

    let financialHealth = 0;
    // Savings Rate
    if (savingsRate >= 40) {
        financialHealth += 30;
    }
    else if (savingsRate >= 25) {
        financialHealth += 20;
    }
    else if (savingsRate >= 10) {
        financialHealth += 10;
    }

    // Goal Progress
    if (goalProgress >= 75) {
        financialHealth += 20;
    }
    else if (goalProgress >= 40) {
        financialHealth += 15;
    }
    else if (goalProgress > 0) {
        financialHealth += 10;
    }

    // Loan Health
    if (totalLoanAmount === 0) {
        financialHealth += 20;
    }
    else if (totalLoanAmount >= totalIncome) {
        financialHealth += 15;
    }
    else {
        financialHealth += 5;
    }

    //Asset Health
    if (totalAssetValue >= totalIncome * 12) {
        financialHealth += 30;
    }
    else if (totalAssetValue >= totalIncome * 6) {
        financialHealth += 20;
    }
    else if (totalAssetValue > 0) {
        financialHealth += 10;
    }
    

    let healthStatus = "";

    if (financialHealth >= 80) {
        healthStatus = "Excellent";
    }
    else if (financialHealth >= 60) {
        healthStatus = "Good";
    }
    else if (financialHealth >= 40) {
        healthStatus = "Average";
    }
    else {
        healthStatus = "Needs Improvement";
    }

    return {
        totalIncome,totalExpenses,monthlySavings,savingsRate,totalGoalAmount,totalCurrentGoalAmount,
        goalProgress,totalLoanAmount,totalAssetValue,activeLoanCount,financialHealth,healthStatus
    };
}
module.exports=financialAnalyzer