const validateSettings = (req, res, next) => {

    const appearance = req.body.appearance;
    const financial = req.body.financial;
    const language = req.body.language?.trim();
    const allowedThemes = ["light", "dark", "system"];

    if (appearance !== undefined) {
        if(appearance.theme !== undefined &&
            !allowedThemes.includes(appearance.theme)){
            return res.status(400).json({
                success: false,
                message: "Invalid theme."
            });
        }
    }
    if (financial !== undefined) {
        if (financial.salaryDay !== undefined &&
            (Number.isNaN(Number(financial.salaryDay)) ||
             Number(financial.salaryDay) < 1 ||
             Number(financial.salaryDay) > 31)){
            return res.status(400).json({
                success: false,
                message: "Salary day must be between 1 and 31."
            });
        }
    }
    if (req.body.language !== undefined && !language){
        return res.status(400).json({
            success: false,
            message: "Language cannot be empty."
        });
    }
    next();
};

module.exports = validateSettings;