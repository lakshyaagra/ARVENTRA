const validateIncome=(req,res,next)=>{
    const incomeSource=req.body.incomeSource?.trim();
    const amount=Number(req.body.amount)
    const allowedPaymentMethods=["cash","upi","credit-card","debit-card","bank-transfer","wallet","other"];
    const allowedCategories=["salary","business","freelancing","investment","rental","interest","gift","bonus","refund","other"];

    if(!incomeSource){
        return res.status(400).json({
            success: false,
            message: 'Income Source is required' 
        })
    }
    if(Number.isNaN(amount) || amount<=0){
        return res.status(400).json({
            success: false,
            message: 'Amount must be Positive no.' 
        })
    }
    if(req.body.paymentMethod!==undefined && !allowedPaymentMethods.includes(req.body.paymentMethod)){
        return res.status(400).json({
            success: false,
            message: "Invalid Payment Method type."
        });
    }
    if(req.body.category!==undefined && !allowedCategories.includes(req.body.category)){
        return res.status(400).json({
            success: false,
            message: "Invalid Category."
        });
    }
    if(req.body.receivedDate!==undefined){
        const receivedDate = new Date(req.body.receivedDate);
        if (Number.isNaN(receivedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid Recieve date."
            });
        }
        if (receivedDate > new Date()) {
            return res.status(400).json({
                success: false,
                message: "Received date cannot be in the future."
            });
        }
    }
    if(req.body.notes!==undefined && typeof req.body.notes!=="string"){
        return res.status(400).json({
            success:false,
            message: "Notes must be text."
        })
    }

    next();
}
module.exports=validateIncome;