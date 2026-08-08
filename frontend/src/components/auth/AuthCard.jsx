const AuthCard = ({ children }) => {
    return (
        <div
            className="w-full max-w-md rounded-3xl border border-[#24302D]
             bg-[#121817]/90 backdrop-blur-xl shadow-2xl p-10"
        >
            {children}
        </div>
    );
};

export default AuthCard;