import {
    Brain,
    ShieldCheck,
    TrendingUp,
    Target,
} from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "AI Financial Insights",
    },
    {
        icon: TrendingUp,
        title: "Smart Wealth Tracking",
    },
    {
        icon: Target,
        title: "Goal-based Planning",
    },
    {
        icon: ShieldCheck,
        title: "Secure Financial Data",
    },
];

const AuthLeftPanel = () => {
    return (
        <div
            className="
                hidden
                flex-col
                justify-between
                border-r
                border-[#23302D]
                bg-linear-to-br
                from-[#0F1715]
                via-[#0D1312]
                to-[#0A100F]
                p-7
                sm:p-8
                lg:flex
            "
        >
            {/* Brand */}

            <div>
                <div className="flex items-center">
                    <div>
                        <h1
                            className="
                                text-3xl
                                font-black
                                tracking-[0.16em]
                                text-white
                                font-montserrat
                            "
                        >
                            ARVENTRA
                        </h1>

                        <div className="mt-3 flex items-center gap-2">
                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-teal-400
                                    shadow-[0_0_10px_rgba(45,212,191,0.8)]
                                "
                            />

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]
                                    text-teal-400
                                    font-montserrat
                                "
                            >
                                Intelligence that grows your wealth
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}

            <div className="space-y-3">
                {features.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="
                                group
                                flex
                                items-center
                                gap-4
                                rounded-2xl
                                border
                                border-[#23302D]
                                bg-[#141D1B]/80
                                px-4
                                py-3
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:border-teal-500/40
                                hover:bg-[#18221F]
                                hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)]
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-[#29403A]
                                    bg-[#172622]
                                    text-teal-400
                                    transition-all
                                    duration-300
                                    group-hover:border-teal-500/40
                                    group-hover:bg-[#1B302B]
                                    group-hover:text-teal-300
                                "
                            >
                                <Icon size={18} />
                            </div>

                            <span
                                className="
                                    text-sm
                                    font-semibold
                                    tracking-wide
                                    text-slate-300
                                    transition-colors
                                    group-hover:text-white
                                "
                            >
                                {item.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Bottom */}

            <div>
                <div
                    className="
                        mb-4
                        h-px
                        w-full
                        bg-linear-to-r
                        from-[#2A3935]
                        to-transparent
                    "
                />

                <div className="flex items-center gap-2">
                    <span
                        className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-emerald-400
                            shadow-[0_0_8px_rgba(52,211,153,0.7)]
                        "
                    />

                    <p
                        className="
                            text-xs
                            font-medium
                            tracking-wide
                            text-slate-500
                        "
                    >
                        AI-powered Financial Operating System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthLeftPanel;