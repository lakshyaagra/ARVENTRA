const simpleInterestCalculator = (req, res) => {
    const principal = Number(req.query.principal);
    const rate = Number(req.query.rate);
    const time = Number(req.query.time);
    if (Number.isNaN(principal) || principal <= 0 ||
        Number.isNaN(rate) || rate < 0 ||
        Number.isNaN(time) || time <= 0){
        return res.status(400).json({
            success: false,
            message: "Please provide valid principal, rate and time."
        });
    }

    const simpleInterest = (principal * rate * time) / 100;
    const totalAmount = principal + simpleInterest;

    res.status(200).json({
        calculator: "Simple Interest Calculator",
        success: true,

        principal,
        rate,
        time,

        simpleInterest: Number(simpleInterest.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2))
    });
};
const compoundInterestCalculator = (req, res) => {

    const principal = Number(req.query.principal);
    const rate = Number(req.query.rate);
    const time = Number(req.query.time);

    if (Number.isNaN(principal) || principal <= 0 ||
        Number.isNaN(rate) || rate < 0 ||
        Number.isNaN(time) || time <= 0){
        return res.status(400).json({
            success: false,
            message: "Please provide valid principal, rate and time."
        });
    }

    const maturityAmount=principal*Math.pow((1+rate/100),time);
    const interest=maturityAmount-principal;

    res.status(200).json({
        calculator: "Compound Interest Calculator",
        success: true,

        principal,
        rate,
        time,

        interest: Number(interest.toFixed(2)),
        maturityAmount: Number(maturityAmount.toFixed(2))
    });
};
const roiCalculator = (req, res) => {

    const investment = Number(req.query.investment);
    const currentValue = Number(req.query.currentValue);

    if (Number.isNaN(investment) || investment <= 0 ||
        Number.isNaN(currentValue) || currentValue < 0){
        return res.status(400).json({
            success: false,
            message: "Please provide valid investment and current value."
        });
    }

    const profit = currentValue - investment;
    const roi = (profit / investment) * 100;

    res.status(200).json({
        calculator: "ROI Calculator",
        success: true,

        investment,
        currentValue,

        profit: Number(profit.toFixed(2)),
        roi: Number(roi.toFixed(2))
    });
};

//fd is basically compounding interest with compounding interest frequency
const fdCalculator = (req, res) => {

    const principal=Number(req.query.principal);
    const rate=Number(req.query.rate);
    const years=Number(req.query.years);
    const frequency=Number(req.query.frequency);

    const allowedFrequency=[1,2,4,12]; //yearly,semi-yearly,quarterly,monthly

    if (Number.isNaN(principal) || principal <= 0 ||
        Number.isNaN(rate) || rate < 0 ||
        Number.isNaN(years) || years <= 0 ||
        !allowedFrequency.includes(frequency)){
        return res.status(400).json({
            success: false,
            message: "Provide valid principal, rate, years and frequency."
        });
    }

    const maturityAmount= principal*Math.pow(1 +(rate/100)/frequency,frequency*years); //A=P*(1+R/100n​)^nt
    const interestEarned = maturityAmount - principal;

    res.status(200).json({
        calculator: "Fixed Deposit Calculator",
        success: true,

        principal,
        rate,
        years,
        frequency,

        interestEarned: Number(interestEarned.toFixed(2)),
        maturityAmount: Number(maturityAmount.toFixed(2))
    });
};
const rdCalculator = (req, res) => {
    const monthlyDeposit = Number(req.query.monthlyDeposit);
    const annualRate = Number(req.query.rate);
    const years = Number(req.query.years);

    if(Number.isNaN(monthlyDeposit) || monthlyDeposit <= 0 ||
        Number.isNaN(annualRate) || annualRate < 0 ||
        Number.isNaN(years) || years <= 0){
        return res.status(400).json({
            success: false,
            message: "Provide valid monthly deposit, interest rate and years."
        });
    }

    const quarterlyRate = annualRate / 400;
    const totalQuarters = years * 4;

    const maturityAmount =
        monthlyDeposit*(
            (Math.pow(1 + quarterlyRate, totalQuarters) - 1)/
            (1 - Math.pow(1 + quarterlyRate, -1 / 3))
        );

    const totalDeposit = monthlyDeposit * years * 12;
    const interestEarned = maturityAmount - totalDeposit;

    res.status(200).json({
        calculator: "Recurring Deposit Calculator",
        success: true,

        monthlyDeposit,
        annualRate,
        years,

        totalDeposit,

        interestEarned: Number(interestEarned.toFixed(2)),
        maturityAmount: Number(maturityAmount.toFixed(2))
    });

};
const sipCalculator = (req, res) => {

    const monthlyInvestment = Number(req.query.monthlyInvestment);
    const annualReturn = Number(req.query.annualReturn);
    const years = Number(req.query.years);

    if(Number.isNaN(monthlyInvestment) || monthlyInvestment <= 0 ||
        Number.isNaN(annualReturn) || annualReturn < 0 ||
        Number.isNaN(years) || years <= 0){
        return res.status(400).json({
            success: false,
            message: "Provide valid monthly investment, annual return and years."
        });
    }

    const monthlyRate=annualReturn/(12*100);
    const months=years*12;
    
    let futureValue;
    if(annualReturn===0) futureValue = monthlyInvestment * months;
    else futureValue=monthlyInvestment*((Math.pow(1+monthlyRate,months)-1)/monthlyRate)*(1 + monthlyRate);

    const totalInvestment = monthlyInvestment * months;
    const wealthGained = futureValue - totalInvestment;

    res.status(200).json({
        calculator: "SIP Calculator",
        success: true,

        monthlyInvestment,
        annualReturn,
        years,

        totalInvestment,

        wealthGained: Number(wealthGained.toFixed(2)),
        estimatedValue: Number(futureValue.toFixed(2))
    });
};
const lumpsumCalculator = (req, res) => {

    const investment = Number(req.query.investment);
    const annualReturn = Number(req.query.annualReturn);
    const years = Number(req.query.years);

    if (Number.isNaN(investment) || investment <= 0 ||
        Number.isNaN(annualReturn) || annualReturn < 0 ||
        Number.isNaN(years) || years <= 0){
        return res.status(400).json({
            success: false,
            message: "Provide valid values."
        });
    }

    const futureValue=investment*Math.pow(1+annualReturn/100,years);
    const wealthGained = futureValue - investment;

    res.status(200).json({
        calculator: "Mutual Fund Lumpsum Calculator",
        success: true,

        investment,
        annualReturn,
        years,

        wealthGained: Number(wealthGained.toFixed(2)),
        futureValue: Number(futureValue.toFixed(2))
    });

};
const emiCalculator = (req, res) => {

    const principal = Number(req.query.principal);
    const rate = Number(req.query.rate);
    const years = Number(req.query.years);

    if(Number.isNaN(principal) || principal <= 0 ||
        Number.isNaN(rate) || rate < 0 ||
        Number.isNaN(years) || years <= 0
    ){
        return res.status(400).json({
            success: false,
            message: "Provide valid principal, rate and years."
        });
    }

    const monthlyRate=rate/(12*100);
    const months=years* 12;
    let emi;
    if(rate===0){
        emi = principal / months;
    }
    else{
        emi=principal*monthlyRate*Math.pow(1+monthlyRate,months)/(Math.pow(1+monthlyRate,months)-1);
    }
    const totalPayment=emi*months;
    const totalInterest=totalPayment-principal;

    res.status(200).json({
        calculator: "EMI Calculator",
        success: true,

        principal,
        rate,
        years,

        monthlyEMI: Number(emi.toFixed(2)),
        totalInterest: Number(totalInterest.toFixed(2)),
        totalPayment: Number(totalPayment.toFixed(2))
    });

};

//sip formula used
const retirementCalculator = (req, res) => {

    const currentAge = Number(req.query.currentAge);
    const retirementAge = Number(req.query.retirementAge);
    const monthlyInvestment = Number(req.query.monthlyInvestment);
    const annualReturn = Number(req.query.annualReturn);

    if(Number.isNaN(currentAge) ||
        Number.isNaN(retirementAge) ||
        Number.isNaN(monthlyInvestment) ||
        Number.isNaN(annualReturn)){
        return res.status(400).json({
            success: false,
            message: "Provide valid values."
        });
    }

    if(currentAge<=0 || retirementAge<=currentAge){
        return res.status(400).json({
            success: false,
            message: "Retirement age must be greater than current age."
        });
    }

    if(monthlyInvestment<=0 || annualReturn<0){
        return res.status(400).json({
            success: false,
            message: "Invalid investment or return."
        });
    }

    const years=retirementAge-currentAge;
    const months=years*12;

    const monthlyRate=annualReturn/(12*100);

    let futureValue;
    if(annualReturn===0) futureValue = monthlyInvestment * months;
    else futureValue=monthlyInvestment*((Math.pow(1+monthlyRate,months)-1)/monthlyRate)*(1+monthlyRate);

    const totalInvestment=monthlyInvestment*months;
    const wealthCreated=futureValue-totalInvestment;

    res.status(200).json({
        calculator: "Retirement Calculator",
        success: true,

        currentAge,
        retirementAge,

        investmentYears: years,
        monthlyInvestment,
        annualReturn,
        totalInvestment,

        wealthCreated: Number(wealthCreated.toFixed(2)),
        retirementCorpus: Number(futureValue.toFixed(2))
    });
};

const incomeTaxCalculator = (req, res) => {

    const annualIncome = Number(req.query.annualIncome);

    if (Number.isNaN(annualIncome) || annualIncome < 0) {
        return res.status(400).json({
            success: false,
            message: "Provide a valid annual income."
        });
    }

    let tax = 0;
    let remaining = annualIncome;

    const slabs = [
        { limit: 400000, rate: 0 },
        { limit: 400000, rate: 0.05 },
        { limit: 400000, rate: 0.10 },
        { limit: 400000, rate: 0.15 },
        { limit: 400000, rate: 0.20 },
        { limit: 400000, rate: 0.25 }
    ];

    for (const slab of slabs) {
        if (remaining <= 0) break;
        const taxable = Math.min(remaining, slab.limit);
        tax += taxable * slab.rate;
        remaining -= taxable;
    }
    if(remaining>0){
        tax+=remaining*0.30;
    }
    res.status(200).json({
        calculator: "Income Tax Calculator",
        success: true,
        annualIncome,

        estimatedTax:Number(tax.toFixed(2)),

        incomeAfterTax:Number(
            (annualIncome-tax).toFixed(2)
        )
    });
};

module.exports={ simpleInterestCalculator,compoundInterestCalculator,roiCalculator,
                 fdCalculator,rdCalculator,sipCalculator,lumpsumCalculator,emiCalculator,
                 retirementCalculator,incomeTaxCalculator }