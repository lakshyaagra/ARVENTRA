import React, { useEffect, useState } from "react";
import {
    MessageCircle,
    Send,
    Trash2,
    Clock3,
    CheckCircle2,
    AlertCircle,
    Menu,
    X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ARVENTRA from "../assets/ARVENTRA.png";
import useAuth from "../hooks/authHook";
import {
    fetchContacts,
    createContact,
    deleteContact,
    clearCreateSuccess,
} from "../features/contact/contactSlice";

const Eyebrow = ({ children }) => (
    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {children}
    </p>
);

const SectionCard = ({
    icon: Icon,
    eyebrow,
    title,
    description,
    children,
}) => (
    <section className="rounded-2xl border border-[#293533] bg-[#171F1E] p-6 sm:p-7">
        <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#293533] bg-[#1B2422]">
                <Icon className="h-4 w-4 text-teal-500" aria-hidden="true" />
            </div>
            <div>
                <Eyebrow>{eyebrow}</Eyebrow>
                <h2 className="mt-2 text-xl font-medium text-slate-100">
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {description}
                    </p>
                )}
            </div>
        </div>
        <div className="mt-7">{children}</div>
    </section>
);

const fieldClasses = "mt-2 w-full rounded-lg border border-[#35413F] bg-[#121817] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-colors focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/10";

const Contact = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();

    const {
        contacts,
        loading,
        creating,
        deleting,
        error,
        createError,
        createSuccess,
    } = useSelector((state) => state.contact);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [validationError, setValidationError] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavClick = (path) => {
        setIsMenuOpen(false);
        navigate(path);
    };

    /* ================================================================
       FETCH CONTACT HISTORY (account holders only — the endpoint
       requires a login, so anonymous visitors skip this entirely)
       ================================================================ */
    useEffect(() => {
        if (!isAuthenticated) return;
        dispatch(fetchContacts());
    }, [dispatch, isAuthenticated]);

    /* ================================================================
       SUCCESS
       ================================================================ */
    useEffect(() => {
        if (!createSuccess) return;

        setName("");
        setEmail("");
        setSubject("");
        setMessage("");

        const timer = setTimeout(() => {
            dispatch(clearCreateSuccess());
        }, 3500);

        return () => clearTimeout(timer);
    }, [createSuccess, dispatch]);

    /* ================================================================
       SUBMIT
       ================================================================ */
    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidationError("");

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanSubject = subject.trim();
        const cleanMessage = message.trim();

        if (!isAuthenticated) {
            if (!cleanName) {
                setValidationError("Name is required.");
                return;
            }

            if (cleanName.length < 2) {
                setValidationError("Name must contain at least 2 characters.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!cleanEmail || !emailPattern.test(cleanEmail)) {
                setValidationError("Please enter a valid email address.");
                return;
            }
        }

        if (!cleanSubject) {
            setValidationError("Subject is required.");
            return;
        }

        if (cleanSubject.length < 5) {
            setValidationError("Subject must contain at least 5 characters.");
            return;
        }

        if (cleanSubject.length > 100) {
            setValidationError("Subject cannot exceed 100 characters.");
            return;
        }

        if (!cleanMessage) {
            setValidationError("Message is required.");
            return;
        }

        if (cleanMessage.length < 20) {
            setValidationError("Message should contain at least 20 characters.");
            return;
        }

        const payload = {
            subject: cleanSubject,
            message: cleanMessage,
        };

        if (!isAuthenticated) {
            payload.name = cleanName;
            payload.email = cleanEmail;
        }

        await dispatch(createContact(payload));
    };

    /* ================================================================
       DELETE
       ================================================================ */
    const handleDelete = (id) => {
        dispatch(deleteContact(id));
    };

    return (
        <div className="min-h-screen bg-[#111817] text-white">
            {/* =========================================================
                NAVBAR
            ========================================================= */}
            <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#111817]/40 backdrop-blur-[30px] backdrop-saturate-200">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-9">
                    {/* Logo */}
                    <div
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => handleNavClick("/")}
                    >
                        <img
                            src={ARVENTRA}
                            alt="Logo"
                            className="h-10 w-10 cursor-pointer object-contain"
                        />
                        <button className="cursor-pointer text-xl font-semibold tracking-wide text-white">
                            ARVENTRA
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
                        <button
                            onClick={() => navigate("/contact")}
                            className="text-teal-400"
                        >
                            Contact
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="transition hover:text-white"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => navigate("/learning")}
                            className="transition hover:text-white"
                        >
                            Learn
                        </button>
                        <button
                            onClick={() => navigate("/calculators")}
                            className="transition hover:text-white"
                        >
                            Calculators
                        </button>

                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="rounded-lg border border-[#40504D] px-4 py-2 text-slate-200 transition hover:border-teal-500 hover:text-teal-400"
                            >
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="transition hover:text-white"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="rounded-lg border border-[#40504D] px-4 py-2 text-slate-200 transition hover:border-teal-500 hover:text-teal-400"
                                >
                                    Create account
                                </button>
                            </>
                        )}
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-[#1C2624] hover:text-white md:hidden"
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMenuOpen && (
                    <div className="border-b border-white/10 bg-[#111817]/95 px-6 py-4 md:hidden">
                        <nav className="flex flex-col gap-4 text-left text-sm text-slate-300">
                            <button
                                onClick={() => handleNavClick("/contact")}
                                className="py-2 text-left text-teal-400"
                            >
                                Contact
                            </button>
                            <button
                                onClick={() => handleNavClick("/")}
                                className="py-2 text-left transition hover:text-white"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => handleNavClick("/learning")}
                                className="py-2 text-left transition hover:text-white"
                            >
                                Learn
                            </button>
                            <button
                                onClick={() => handleNavClick("/calculators")}
                                className="py-2 text-left transition hover:text-white"
                            >
                                Calculators
                            </button>

                            <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-4">
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => handleNavClick("/dashboard")}
                                        className="w-full rounded-lg border border-[#40504D] py-2.5 text-center text-slate-200 transition hover:border-teal-500 hover:text-teal-400"
                                    >
                                        Dashboard
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleNavClick("/login")}
                                            className="w-full py-2 text-left transition hover:text-white"
                                        >
                                            Sign in
                                        </button>
                                        <button
                                            onClick={() => handleNavClick("/register")}
                                            className="w-full rounded-lg border border-[#40504D] py-2.5 text-center text-slate-200 transition hover:border-teal-500 hover:text-teal-400"
                                        >
                                            Create account
                                        </button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* =========================================================
                MAIN
            ========================================================= */}
            <main className="mx-auto max-w-7xl px-6 pb-16 pt-32">
                <div className="mb-8 max-w-3xl">
                    <Eyebrow>Support</Eyebrow>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">
                        Contact ARVENTRA
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                        Have a question, found an issue, or want to share
                        feedback? Send us a message below — no account
                        required.
                        {isAuthenticated && (
                            " Since you're signed in, we'll link this to your account and you can track it below."
                        )}
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    {/* =================================================
                        CONTACT FORM
                    ================================================= */}
                    <SectionCard
                        icon={MessageCircle}
                        eyebrow="Message"
                        title="Send us a message"
                        description="Tell us what you need help with. Please provide enough detail for us to understand the issue."
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* NAME + EMAIL — only needed when not signed in */}
                            {!isAuthenticated && (
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="contact-name"
                                            className="text-sm text-slate-300"
                                        >
                                            Name
                                        </label>

                                        <input
                                            id="contact-name"
                                            type="text"
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                            placeholder="Your name"
                                            className={fieldClasses}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contact-email"
                                            className="text-sm text-slate-300"
                                        >
                                            Email
                                        </label>

                                        <input
                                            id="contact-email"
                                            type="email"
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(event.target.value)
                                            }
                                            placeholder="you@example.com"
                                            className={fieldClasses}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* SUBJECT */}
                            <div>
                                <label
                                    htmlFor="contact-subject"
                                    className="text-sm text-slate-300"
                                >
                                    Subject
                                </label>

                                <input
                                    id="contact-subject"
                                    type="text"
                                    value={subject}
                                    onChange={(event) =>
                                        setSubject(event.target.value)
                                    }
                                    maxLength={100}
                                    placeholder="What can we help you with?"
                                    className={fieldClasses}
                                />

                                <p className="mt-2 text-right text-[11px] text-slate-600">
                                    {subject.length}/100
                                </p>
                            </div>

                            {/* MESSAGE */}
                            <div>
                                <label
                                    htmlFor="contact-message"
                                    className="text-sm text-slate-300"
                                >
                                    Message
                                </label>

                                <textarea
                                    id="contact-message"
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(event.target.value)
                                    }
                                    rows={7}
                                    placeholder="Describe your question, issue, or feedback..."
                                    className={fieldClasses + " resize-y leading-6"}
                                />

                                <p className="mt-2 text-right text-[11px] text-slate-600">
                                    {message.length} characters
                                </p>
                            </div>

                            {/* ERROR */}
                            {(validationError || createError) && (
                                <div className="flex items-start gap-2 rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                    <p className="text-sm leading-5 text-red-400">
                                        {validationError || createError}
                                    </p>
                                </div>
                            )}

                            {/* SUCCESS */}
                            {createSuccess && (
                                <div className="flex items-center gap-2 rounded-lg border border-teal-900/40 bg-teal-950/20 px-4 py-3">
                                    <CheckCircle2 className="h-4 w-4 text-teal-400" />
                                    <p className="text-sm text-teal-400">
                                        Your message has been submitted successfully.
                                    </p>
                                </div>
                            )}

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={creating}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-3 text-sm font-medium text-[#07100E] transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
                            >
                                <Send className="h-4 w-4" />
                                {creating ? "Sending..." : "Send message"}
                            </button>
                        </form>
                    </SectionCard>

                    {/* =================================================
                        SIDE INFORMATION
                    ================================================= */}
                    <div className="space-y-6">
                        <SectionCard
                            icon={Clock3}
                            eyebrow="Support"
                            title="What happens next?"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                    <p className="text-sm leading-6 text-slate-500">
                                        {isAuthenticated
                                            ? "Your message is securely associated with your ARVENTRA account."
                                            : "We'll get back to you at the email address you provide."}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                    <p className="text-sm leading-6 text-slate-500">
                                        {isAuthenticated
                                            ? "You can keep track of your submitted requests from this page."
                                            : "Sign in to keep track of your submitted requests from this page."}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                    <p className="text-sm leading-6 text-slate-500">
                                        Requests remain marked as pending until they are resolved.
                                    </p>
                                </div>
                            </div>
                        </SectionCard>

                        {/* =============================================
                            CONTACT HISTORY — account holders only, since
                            the history endpoint requires a login
                        ============================================= */}
                        {isAuthenticated && (
                            <SectionCard
                                icon={MessageCircle}
                                eyebrow="History"
                                title="Your requests"
                                description="Previously submitted contact requests."
                            >
                                {loading ? (
                                    <div className="py-8 text-center">
                                        <p className="text-sm text-slate-500">
                                            Loading your requests...
                                        </p>
                                    </div>
                                ) : error ? (
                                    <div className="py-6 text-center">
                                        <p className="text-sm text-red-400">
                                            {error}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                dispatch(fetchContacts())
                                            }
                                            className="mt-4 text-sm text-teal-400 hover:text-teal-300"
                                        >
                                            Try again →
                                        </button>
                                    </div>
                                ) : contacts.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-[#293533] px-5 py-8 text-center">
                                        <MessageCircle className="mx-auto h-5 w-5 text-slate-600" />
                                        <p className="mt-3 text-sm text-slate-500">
                                            You haven't submitted any contact requests yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {contacts.map((contact) => (
                                            <div
                                                key={contact._id}
                                                className="rounded-xl border border-[#293533] bg-[#1B2422] p-4"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-slate-200">
                                                            {contact.subject}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-600">
                                                            {new Date(
                                                                contact.createdAt
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-sm leading-6 text-slate-500">
                                                    {contact.message}
                                                </p>
                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        type="button"
                                                        disabled={deleting}
                                                        onClick={() =>
                                                            handleDelete(
                                                                contact._id
                                                            )
                                                        }
                                                        className="flex items-center gap-1.5 text-xs text-slate-600
                                                        transition-colors hover:text-red-400 disabled:opacity-50"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SectionCard>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;