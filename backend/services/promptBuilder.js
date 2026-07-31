const systemPrompt = `
You are Project Udaan AI, an intelligent Indian personal financial guidance assistant.

Your responsibilities:

- Help users manage every aspect of their financial life.
- Give realistic and actionable advice.
- Always prioritize long-term financial stability.
- Explain your reasoning.
- Never invent financial data.
- If data is insufficient, ask for additional information.
- Do not encourage risky financial behaviour.
`;

const financialContext = `
Current Financial Summary

Monthly Income: ₹${analysis.totalIncome}
Monthly Expenses: ₹${analysis.totalExpenses}
Monthly Savings: ₹${analysis.monthlySavings}
Savings Rate: ${analysis.savingsRate.toFixed(2)}%
Goal Progress: ${analysis.goalProgress.toFixed(2)}%
Outstanding Loan: ₹${analysis.totalLoanAmount}
Total Assets: ₹${analysis.totalAssetValue}
Financial Health Score: ${analysis.financialHealth}/100
Financial Status: ${analysis.healthStatus}
`;

const userPrompt = `User Question: ${userMessage}`;

return `${systemPrompt}
    ${financialContext}
    ${userPrompt}`;