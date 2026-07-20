const validateExpense=(req,res,next)=>{
    const expenseName=req.body.expenseName?.trim();
    const amount=Number(req.body.amount);

    const allowedCategories=["food","transport","shopping","entertainment","health",
            "education","bills","travel","investment","family","other"];
    const allowedMethods=["cash","upi","credit-card","debit-card","bank-transfer","wallet","other"];

    if(!expenseName){
        return res.status(400).json({
            message: "Expense name is required.",
            success:false
        })
    }
    if(Number.isNaN(amount) || amount <= 0){
        return res.status(400).json({
            success: false,
            message: 'Expense amount must be a positive number' 
        });
    }
    if(req.body.category!==undefined && !allowedCategories.includes(req.body.category)){
        return res.status(400).json({
            success:false,
            message:'Invalid Category'
        })
    }
    if(req.body.paymentMethod!==undefined && !allowedMethods.includes(req.body.paymentMethod)){
        return res.status(400).json({
            success:false,
            message:'Payment Method not Available.'
        })
    }
    if(req.body.expenseDate!==undefined){
        const expenseDate=new Date(req.body.expenseDate);
        if(Number.isNaN(expenseDate.getTime())){
            return res.status(400).json({
                success:false,
                message:"Invalid Expense Date"
            })
        }
        if(expenseDate > new Date()){
            return res.status(400).json({
                success:false,
                message:"Expense date cannot be in the future."
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
module.exports=validateExpense