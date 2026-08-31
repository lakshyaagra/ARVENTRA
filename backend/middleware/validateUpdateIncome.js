const validateUpdateIncome=(req,res,next)=>{
    const { incomeSource,amount,category,paymentMethod,receivedDate,notes } = req.body;
    const allowedCategories=["salary","business","freelancing","investment","rental","interest","gift","bonus","refund","other"];
    const allowedPaymentMethods=["cash","upi","credit-card","debit-card","bank-transfer","wallet","other"];


    if(incomeSource!==undefined){
        if (incomeSource.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Income Source cannot be empty."
            });
        }
    }
    if(amount!==undefined){
        const parsedAmount=Number(amount);
        if(Number.isNaN(parsedAmount) || parsedAmount<=0){
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number"
            });
        }
    }
    if(category!==undefined && !allowedCategories.includes(category)){
        return res.status(400).json({
            success: false,
            message: "Invalid Category"
        })
    }
    if(paymentMethod!==undefined && !allowedPaymentMethods.includes(paymentMethod)){
        return res.status(400).json({
            success: false,
            message: "Invalid Category"
        })
    }
    if(notes!==undefined){
        if(typeof notes!=="string"){
            return res.status(400).json({
                success:false,
                message: "Notes must be text."
            })
        }
    }
    if(receivedDate!==undefined){
        const parsedReceivedDate=new Date(receivedDate);
        if(Number.isNaN(parsedReceivedDate.getTime())){
            return res.status(400).json({
                success:false,
                message:"Invalid Recieve Date."
            })
        }
        if(parsedReceivedDate>new Date()){
            return res.status(400).json({
                success: false,
                message: "Recieve date cannot be in the future."
            });
        }
    }

    next();
}
module.exports=validateUpdateIncome;