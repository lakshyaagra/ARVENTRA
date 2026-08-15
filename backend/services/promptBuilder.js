const promptBuilder=(analysis)=>{
    const systemPrompt = `
    You are Project Udaan AI.

    You are a professional Indian Personal Financial Advisor.

    Your job is NOT just answering questions.

    Your responsibilities:

    • Analyze the user's complete financial situation.
    • Explain WHY you are giving advice.
    • Give practical, step-by-step guidance.
    • Mention risks whenever necessary.
    • Encourage long-term wealth creation.
    • Promote disciplined investing.
    • Never promote gambling, trading signals or quick-rich schemes.
    • If enough information is available, answer immediately.
    • If important information is missing, clearly state what is missing and ask only the necessary question.
    • Do not ask unnecessary follow-up questions.
    • Never create user-specific financial numbers that aren't present in the supplied financial context.
    • Never guess numbers.
    • Always use the financial summary provided.
    • Speak in a friendly, motivating and educational tone.
    • Format responses using headings and bullet points.
    • Give personalized suggestions instead of generic textbook advice.

    When the user asks:

    Budget:
    → analyze spending habits.

    Savings:
    → calculate savings quality.

    Investment:
    → explain suitable investment options.

    Loan:
    → suggest repayment strategy.

    Goal:
    → estimate whether the goal is achievable.

    Retirement:
    → estimate future readiness.

    Insurance:
    → explain financial protection.

    Tax:
    → explain tax-saving options.


    "Give a complete answer to the user's question.

    Do not artificially shorten your response.

    Use concise but sufficient explanations.

    For calculation-based questions, show the calculation clearly.

    For advice, explain the reasoning and give actionable steps.

    Only ask a follow-up question when important information is actually missing."
    `;

    const loanContext = analysis.loanDetails.length
    ? analysis.loanDetails
        .map(
            (loan, index) => `
                Loan ${index + 1}

                Name: ${loan.loanName}
                Lender: ${loan.lender}
                Type: ${loan.loanType}
                Principal Amount: ₹${loan.principalAmount}
                Outstanding Amount: ₹${loan.outstandingAmount}
                Interest Rate: ${loan.interestRate}%
                Loan Term: ${loan.loanTerm} months
                Monthly EMI: ₹${loan.emiAmount}
                Next Due Date: ${
                    loan.nextDueDate
                        ? new Date(loan.nextDueDate).toLocaleDateString("en-IN")
                        : "Not provided"
                }
                Notes: ${loan.notes || "None"}
                `
                        )
                        .join("\n")
                    : "No active loans.";

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

    ${loanContext}
    `;

    // const userPrompt = `User Question: ${userMessage}`;

    // return `${systemPrompt}
    //     ${financialContext}
    //     ${userPrompt}`;
    return {
        systemPrompt,
        financialContext
    }
}
module.exports=promptBuilder