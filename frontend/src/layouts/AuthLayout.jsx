import AuthLeftPanel from "../components/auth/AuthLeftPanel";

export const AuthLayout = ({ children }) => {
    return (
        <div
            className="
                relative
                flex
                h-screen
                w-full
                items-center
                justify-center
                overflow-hidden
                bg-[#070A09]
                px-4
                py-4
            "
        >
            {/* Background Glow */}

            <div className="pointer-events-none absolute inset-0">
                {/* Teal glow */}

                <div
                    className="
                        absolute
                        -left-40
                        -top-40
                        h-105
                        w-105
                        rounded-full
                        bg-teal-500/10
                        blur-[150px]
                    "
                />

                {/* Emerald glow */}

                <div
                    className="
                        absolute
                        -bottom-40
                        -right-40
                        h-105
                        w-105
                        rounded-full
                        bg-emerald-400/10
                        blur-[150px]
                    "
                />

                {/* Subtle center glow */}

                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-80
                        w-80
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-teal-500/2.5
                        blur-[120px]
                    "
                />

                {/* Dot grid */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(#ffffff_1px,transparent_1px)]
                        bg-size-[24px_24px]
                        opacity-[0.025]
                    "
                />

                {/* Soft vignette */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_center,transparent_25%,#070A09_100%)]
                    "
                />
            </div>

            {/* Main Auth Container */}

            <div
                className="
                    relative
                    z-10
                    grid
                    h-[min(620px,calc(100vh-32px))]
                    w-full
                    max-w-5xl
                    overflow-hidden
                    rounded-[28px]
                    border
                    border-[#263532]
                    bg-[#101615]/95
                    shadow-[0_30px_90px_rgba(0,0,0,0.55)]
                    backdrop-blur-xl
                    lg:grid-cols-[0.9fr_1.1fr]
                    animate-[authEnter_.7s_ease-out]
                "
            >
                {/* Left Panel */}

                <AuthLeftPanel />

                {/* Right Panel */}

                <div
                    className="
                        relative
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                        bg-[#141A19]
                        p-6
                        sm:p-8
                        lg:p-10
                    "
                >
                    {/* Right panel subtle glow */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-32
                            -top-32
                            h-72
                            w-72
                            rounded-full
                            bg-teal-500/[0.035]
                            blur-[100px]
                        "
                    />

                    <div
                        className="
                            relative
                            z-10
                            w-full
                            max-w-sm
                        "
                    >
                        {children}
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes authEnter {
                        from {
                            opacity: 0;
                            transform: translateY(14px) scale(0.99);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}
            </style>
        </div>
    );
};
