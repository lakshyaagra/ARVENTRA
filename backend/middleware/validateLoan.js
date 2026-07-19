const validateLoan=(req,res,next)=>{
    const loanName=req.body.loanName?.trim();
    const lender=req.body.lender?.trim();
    const principalAmount=Number(req.body.principalAmount);
    const outstandingAmount=Number(req.body.outstandingAmount);
    const interestRate=Number(req.body.interestRate);
    const loanTerm=Number(req.body.loanTerm);
    const emiAmount=req.body.emiAmount!==undefined?Number(req.body.emiAmount):undefined;
    const allowedLoanTypes=["home","education","vehicle","gold","personal","business","credit-card","friend","relative","other"];

    if (!loanName){
        return res.status(400).json({
            success: false,
            message: 'Loan name is required' 
        });
    }
    if (!lender){
        return res.status(400).json({
            success: false,
            message: 'Lender is required' 
        });
    }
    if (Number.isNaN(principalAmount) || principalAmount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Principal amount must be a positive number."
        });
    }
    if (Number.isNaN(outstandingAmount) || outstandingAmount < 0) {
        return res.status(400).json({
            success: false,
            message: "Outstanding amount cannot be negative."
        });
    }
    if(outstandingAmount>principalAmount){
        return res.status(400).json({
            success: false,
            message: "Outstanding amount cannot be greater than principal amount."
        });
    }
    if (Number.isNaN(interestRate) || interestRate < 0) {
        return res.status(400).json({
            success: false,
            message: "Interest rate cannot be negative."
        });
    }
    if (Number.isNaN(loanTerm) || loanTerm < 1) {
        return res.status(400).json({
            success: false,
            message: "Loan term must be at least 1 month."
        });
    }
    if (req.body.loanType !== undefined && !allowedLoanTypes.includes(req.body.loanType)) {
        return res.status(400).json({
            success: false,
            message: "Invalid loan type."
        });
    }
    if (emiAmount !== undefined && (Number.isNaN(emiAmount) || emiAmount < 0)){
        return res.status(400).json({
            success: false,
            message: "EMI amount cannot be negative."
        });
    }
    if (req.body.nextDueDate) {
        const nextDueDate = new Date(req.body.nextDueDate);
        if (Number.isNaN(nextDueDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid next due date."
            });
        }
    }
    if(req.body.notes && req.body.notes.trim()===""){
        return res.status(400).json({
            success:false,
            message: "Notes can't be empty."
        })
    }
    next();
}
module.exports=validateLoan;