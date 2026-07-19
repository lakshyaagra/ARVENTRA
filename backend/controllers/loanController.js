const Loan=require('../models/Loan')

const createLoan=async (req,res)=>{
    try{
        req.body.user=req.user.id;
        const outstandingAmount=Number(req.body.outstanding)
        if(outstandingAmount===0){
            req.body.status='closed';
        }
        else{
            req.body.status='active';
        }
        const loan=await Loan.create(req.body);
        res.status(201).json({
            message: "Loan Created",
            success: true,
            loan
        });
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false,
        })
    }
}
const getLoans=async (req,res)=>{
    try{
        //sorting
        const sortField=req.query.sort || 'createdAt';
        const allowedSortFields = ["createdAt","loanName","principalAmount","outstandingAmount","interestRate","loanTerm","status"];
        const order=req.query.order || 'desc';
        if(!allowedSortFields.includes(sortField) || (order!=='asc' && order!=='desc')){
            return res.status(400).json({
                message: "Invalid sort field or order.",
                success: false
            });
        }
        const sortOrder=order==="asc"?1:-1;
        const sortObject={
            [sortField]:sortOrder
        }
        const allowedStatus=["active","closed"];
        if(req.query.status && !allowedStatus.includes(req.query.status) ){
            return res.status(400).json({
                message: "Invalid status.",
                success: false
            });
        }

        //filtering
        const filter={
            user:req.user.id,
        }
        if(req.query.status){
            filter.status=req.query.status
        }

        //searching
        const search=req.query.search?.trim()
        if(search){
            filter.loanName={
                $regex:search,
                $options:"i"
            }
        }

        //pagination
        const page=Number(req.query.page) || 1;
        const limit=Number(req.query.limit) || 15;
        const skip=limit*(page-1);
        const totalLoans=await Loan.countDocuments(filter);
        const totalPages=Math.ceil(totalLoans/limit);
        const hasNextPage=page<totalPages;
        const hasPreviousPage=page>1;

        const loans=await Loan.find(filter).populate('user',"name email")
                    .sort(sortObject).skip(skip).limit(limit);
        
        res.status(200).json({
            message:" Loans Retrieved ",
            success:true,
            currPage:page,
            totalLoans,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            loans,
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const getLoanById=async (req,res)=>{
    try{
        const id=req.params.id;  //as mongoDB generates id alphanumeric , converting to number will give NaN
        const loan=await Loan.findOne({
            _id: id,
            user: req.user.id
        });
        if(!loan){    //agr id meri document me nahi hai to null return karega
            return res.status(404).json({
                message: "Loan not found",
                success: false
            })
        }
        //else wala case , agr id meri document me hai to goal return karega
        res.status(200).json({
            message: "Loan Retrieved",
            success: true,
            loan
        })

    }
    catch(err){   //database fail wala case  
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const updateLoanById=async (req,res)=>{
    try{
        const id=req.params.id;
        const loan=await Loan.findOne({
            _id: id, 
            user: req.user.id
        });
        if(!loan){
            return res.status(404).json({
                error: "Loan not found",
                success: false
            })
        }
        const updatedPrincipalAmount=req.body.principalAmount!==undefined
                   ?Number(req.body.principalAmount):loan.principalAmount;
        const updatedOutstandingAmount=req.body.outstandingAmount!==undefined
                   ?Number(req.body.outstandingAmount):loan.outstandingAmount;
        if(updatedOutstandingAmount>updatedPrincipalAmount){
            return res.status(400).json({
                success: false,
                message: "Outstanding amount cannot be greater than principal amount."
            });
        }
        Object.assign(loan,req.body);
        if(updatedOutstandingAmount===0){
            loan.status="closed";
        }
        else{
            loan.status="active";
        }
        await loan.save();
        res.status(200).json({
            message: "Loan Updated",
            success: true,
            loan
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}
const deleteLoanById=async (req,res)=>{
    try{
        const id=req.params.id;
        const loan=await Loan.findOne({
            _id: id,
            user: req.user.id
        });
        if(!loan){
            return res.status(404).json({
                message: "Loan not found",
                success: false
            })
        }
        await loan.deleteOne()
        res.status(200).json({
            message: "Loan Deleted",
            success: true,
            loan
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}

module.exports={ createLoan,getLoans,getLoanById,updateLoanById,deleteLoanById }
