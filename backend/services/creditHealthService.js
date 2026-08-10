const calculateCreditHealthScore = ({
  savingsRate,
  debtToIncomeRatio,
  assetLoanRatio,
  activeLoans,
}) => {
  let score = 0;

  // Savings — 35 points
  if (savingsRate >= 40) score += 35;
  else if (savingsRate >= 35) score += 30;
  else if (savingsRate >= 20) score += 25;
  else if (savingsRate >= 10) score += 15;
  else score += 5;

  // Debt-to-Income — 35 points
  if (debtToIncomeRatio < 0.2) score += 35;
  else if (debtToIncomeRatio < 0.35) score += 30;
  else if (debtToIncomeRatio < 0.5) score += 20;
  else if (debtToIncomeRatio < 0.7) score += 10;
  else score += 5;

  // Asset Coverage — 20 points
  if (assetLoanRatio === null) score += 20;
  else if (assetLoanRatio > 5) score += 20;
  else if (assetLoanRatio >= 3) score += 15;
  else if (assetLoanRatio >= 2) score += 10;
  else if (assetLoanRatio >= 1) score += 5;

  // Active Loans — 10 points
  if (activeLoans === 0) score += 10;
  else if (activeLoans === 1) score += 8;
  else if (activeLoans === 2) score += 6;
  else if (activeLoans === 3) score += 4;
  else score += 2;

  return score;
};

const getCreditHealthStatus = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Average";
  if (score >= 40) return "Poor";

  return "Critical";
};

module.exports = {
  calculateCreditHealthScore,
  getCreditHealthStatus,
};