const validateUpdateExpense=(req,res,next)=>{

    const { expenseName,amount,category,paymentMethod,expenseDate,notes }=req.body;
    const allowedCategories=["food","transport","shopping","entertainment","health",
            "education","bills","travel","investment","family","other"];
    const allowedMethods=["cash","upi","credit-card","debit-card","bank-transfer","wallet","other"];

    if(expenseName!==undefined){
        if(expenseName.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Expense name cannot be empty"
            });
        }
    }
    if(amount!==undefined){
        const parsedAmount = Number(amount);
        if(Number.isNaN(parsedAmount) || parsedAmount <= 0){
            return res.status(400).json({
                success: false,
                message: "Amount value must be positive"
            });
        }
    }
    if(category!==undefined && !allowedCategories.includes(category)){
        return res.status(400).json({
            success:false,
            message:'Invalid Category'
        })
    }
    if(paymentMethod!==undefined && !allowedMethods.includes(paymentMethod)){
        return res.status(400).json({
            success:false,
            message:'Invalid Payment Method'
        })
    }
    if(expenseDate!==undefined){
        const parsedExpenseDate=new Date(expenseDate);
        if(Number.isNaN(parsedExpenseDate.getTime())){
            return res.status(400).json({
                success:false,
                message:"Invalid Expense Date"
            })
        }
        if (parsedExpenseDate > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Expense date cannot be in the future."
            });
        }
    }
    if(notes!==undefined){
        if(typeof notes!=="string"){
            return res.status(400).json({
                success:false,
                message: "Notes must be text."
            })
        }
    }
    next()
}

module.exports=validateUpdateExpense