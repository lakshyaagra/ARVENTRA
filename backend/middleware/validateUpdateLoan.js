const validateUpdateLoan=(req,res,next)=>{
    const {loanName,lender,principalAmount,outstandingAmount,interestRate,loanTerm,loanType,emiAmount,nextDueDate,notes} = req.body;
    const allowedLoanTypes=["home","education","vehicle","gold","personal","business","credit-card","friend","relative","other"];

    if (loanName !== undefined) {
        if (loanName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Loan name cannot be empty."
            });
        }
    }
    if (lender !== undefined) {
        if (lender.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Lender name cannot be empty."
            });
        }
    }
    if(principalAmount !== undefined) {
        const parsedPrincipalAmount = Number(principalAmount);
        if(Number.isNaN(parsedPrincipalAmount) || parsedPrincipalAmount <= 0){
            return res.status(400).json({
                success: false,
                message: "Principal amount must be a positive number"
            });
        }
    }
    if(outstandingAmount !== undefined) {
        const parsedOutstandingAmount = Number(outstandingAmount);
        if(Number.isNaN(parsedOutstandingAmount) || parsedOutstandingAmount < 0){
            return res.status(400).json({
                success: false,
                message: "Outstanding amount can't be negative number."
            });
        }
    }
    const parsedPrincipalAmount=Number(principalAmount);
    const parsedOutstandingAmount=Number(outstandingAmount);
    if(principalAmount!==undefined && outstandingAmount!==undefined && parsedPrincipalAmount<parsedOutstandingAmount){
        return res.status(400).json({
            success:false,
            message:'Outstanding amount cannot be greater than principal amount'
        })
    }
    if(interestRate !== undefined) {
        const parsedInterestRate = Number(interestRate);
        if(Number.isNaN(parsedInterestRate) || parsedInterestRate < 0){
            return res.status(400).json({
                success: false,
                message: "Interest Rate can't be negative."
            });
        }
    }
    if(loanTerm !== undefined) {
        const parsedLoanTerm = Number(loanTerm);
        if(Number.isNaN(parsedLoanTerm) || parsedLoanTerm < 1){
            return res.status(400).json({
                success: false,
                message: "Loan term must be at least 1 month."
            });
        }
    }
    if(loanType!==undefined && !allowedLoanTypes.includes(loanType)){
        return res.status(400).json({
            success: false,
            message: "Invalid Loan Type"
        })
    }
    if(emiAmount !== undefined) {
        const parsedEmiAmount = Number(emiAmount);
        if(Number.isNaN(parsedEmiAmount) || parsedEmiAmount < 0){
            return res.status(400).json({
                success: false,
                message: "Emi Amount can't be negative."
            });
        }
    }
    if(nextDueDate){
        const parsedDueDate=new Date(nextDueDate);
        if(Number.isNaN(parsedDueDate.getTime())){
            return res.status(400).json({
                success:false,
                message:"Invalid Next Due Date"
            })
        }
        if(parsedDueDate<=new Date()){
            return res.status(400).json({
                success: false,
                message: "Next due date must be a future date."
            });
        }
    }
    if (notes !== undefined && notes !== null) {
        if (typeof notes !== "string") {
            return res.status(400).json({
                success: false,
                message: "Notes must be text."
            });
        }
    }
    next();
}
module.exports=validateUpdateLoan;