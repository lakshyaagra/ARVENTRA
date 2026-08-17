import { useNavigate } from "react-router-dom";
import ARVENTRA from "../assets/ARVENTRA.png"

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111817] text-white">
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#111817]/40 backdrop-blur-[30px] backdrop-saturate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex cursor-pointer gap-0 items-center justify-center" onClick={() => navigate("/")}>
            <img src={ ARVENTRA } alt="Logo" className="h-18 w-18 cursor-pointer" />
            <button
                className="text-xl cursor-pointer font-semibold tracking-wide text-white"
            >
                ARVENTRA
            </button>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <button
              onClick={() => navigate("/learning")}
              className="transition hover:text-white"
            >
              Learn
            </button>
            <button
              onClick={() => navigate("/learning")}
              className="transition hover:text-white"
            >
              Community
            </button>
            <button
              onClick={() => navigate("/calculators")}
              className="transition hover:text-white"
            >
              Calculators
            </button>
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
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main className="pt-7">
        <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">

            {/* LEFT */}
            <div>
              
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-teal-400">
                
                A better place to begin with money
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-100 md:text-5xl">
                
                Money gets easier when you understand it.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
                
                Arventra brings financial learning, practical tools, community,
                and a personal AI assistant together so managing money feels a
                little less overwhelming.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                
                <button
                  onClick={() => navigate("/learning")}
                  className="rounded-lg bg-teal-500 px-5 py-3 text-sm font-semibold text-[#0E1514] transition hover:bg-teal-400"
                >
                  
                  Start learning →
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-lg border border-[#35413F] px-9 py-3 text-sm font-medium text-slate-200 transition hover:border-teal-500 hover:text-teal-400"
                >
                  
                  Register
                </button>
              </div>
            </div>
            {/* RIGHT — FINANCIAL JOURNEY */}
            <div className="relative mx-auto w-full max-w-md">
              
              {/* soft background glow */}
              <div className="absolute -inset-10 rounded-full bg-teal-500/5 blur-3xl" />{" "}
              <div className="relative">
                
                <p className="mb-5 text-xs uppercase tracking-[0.2em] text-slate-500">
                  
                  Your financial journey
                </p>
                <div className="space-y-3">
                  
                  <div className="flex items-center gap-4 border-b border-[#293432] pb-5">
                    
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-teal-500/40 text-xs text-teal-400">
                      
                      01
                    </span>
                    <div>
                      
                      <p className="text-sm font-medium text-slate-200">
                        
                        Learn
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        
                        Understand how money actually works.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b border-[#293432] py-5">
                    
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#40504D] text-xs text-slate-400">
                      
                      02
                    </span>
                    <div>
                      
                      <p className="text-sm font-medium text-slate-200">
                        
                        Plan
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        
                        Turn knowledge into realistic goals.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b border-[#293432] py-5">
                    
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#40504D] text-xs text-slate-400">
                      
                      03
                    </span>
                    <div>
                      
                      <p className="text-sm font-medium text-slate-200">
                        
                        Manage
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        
                        Keep track of the decisions that matter.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-5">
                    
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#40504D] text-xs text-slate-400">
                      
                      04
                    </span>
                    <div>
                      
                      <p className="text-sm font-medium text-slate-200">
                        
                        Grow
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        
                        Build confidence with every step.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-l border-teal-500/40 pl-4">
                  
                  <p className="text-sm leading-7 text-slate-500">
                    
                    And when you are unsure,
                    <span className="text-slate-300">
                      
                      ask your personal AI assistant.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= INTRO ================= */}

        <section className="border-y border-[#26302F] bg-[#141B1A]">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.18em] text-teal-400">
                Start wherever you are
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-slate-100 md:text-3xl">
                You don't need to know everything before you begin.
              </h2>
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-3">
              <div className="border-l border-[#33403D] pl-5">
                <span className="text-xs text-slate-600">01</span>

                <h3 className="mt-3 text-lg font-medium text-slate-100">
                  Learn
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Understand financial concepts without drowning in complicated
                  language.
                </p>
              </div>

              <div className="border-l border-[#33403D] pl-5">
                <span className="text-xs text-slate-600">02</span>

                <h3 className="mt-3 text-lg font-medium text-slate-100">
                  Manage
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Keep track of income, expenses, goals, loans, assets, and
                  more.
                </p>
              </div>

              <div className="border-l border-[#33403D] pl-5">
                <span className="text-xs text-slate-600">03</span>

                <h3 className="mt-3 text-lg font-medium text-slate-100">
                  Discuss
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-400">
                  Ask questions, share experiences, and learn from other people.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= AI SECTION ================= */}

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-teal-400">
                Your personal AI assistant
              </p>

              <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-100">
                Not another chatbot sitting on the side.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                Arventra AI is designed to work alongside your financial
                journey — helping you understand your numbers, explore
                decisions, and make everyday money management easier.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="mt-7 text-sm font-medium text-teal-400 transition hover:text-teal-300"
              >
                Explore Arventra AI →
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-6">
                <p className="text-sm font-medium text-slate-200">
                  Understand spending
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Ask questions about where your money is going and make sense
                  of your spending.
                </p>
              </div>

              <div className="rounded-xl border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-6">
                <p className="text-sm font-medium text-slate-200">
                  Work toward your goals
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Turn financial goals into smaller, easier-to-understand steps.
                </p>
              </div>

              <div className="rounded-xl border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-6">
                <p className="text-sm font-medium text-slate-200">
                  Learn financial concepts
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Get complicated financial ideas explained in a way that
                  actually makes sense.
                </p>
              </div>

              <div className="rounded-xl border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-6">
                <p className="text-sm font-medium text-slate-200">
                  Make better decisions
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Compare options and think through financial decisions before
                  acting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FINANCIAL CALCULATORS ================= */}
        <section className="border-y border-[#26302F] bg-[#141B1A]">
          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">

                <p className="text-sm uppercase tracking-[0.18em] text-teal-400">
                  Practical financial tools
                </p>

                <h2 className="mt-3 text-3xl font-semibold text-slate-100 md:text-4xl">
                  Make financial decisions with numbers you can understand.
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-400">
                  Explore simple financial calculators for interest, investments,
                  loans, retirement planning, taxes, and everyday financial decisions.
                  No account required.
                </p>

              </div>

              <button
                onClick={() => navigate("/calculators")}
                className="shrink-0 text-sm font-medium text-teal-400 transition hover:text-teal-300"
              >
                Explore calculators →
              </button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* INVESTMENTS */}

              <div className="rounded-xl  border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-600">
                  Investments
                </p>

                <h3 className="mt-3 text-lg font-medium text-slate-100">
                  Plan your investments
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Estimate returns from SIPs, lump-sum investments, and other
                  investment options.
                </p>
              </div>

              {/* LOANS */}

              <div className="rounded-xl  border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-600">
                  Loans
                </p>

                <h3 className="mt-3 text-lg font-medium text-slate-100">
                  Understand your loan
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Calculate EMIs, total interest, and total payments before taking
                  on a loan.
                </p>
              </div>

              {/* SAVINGS */}

              <div className="rounded-xl  border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-600">
                  Savings
                </p>

                <h3 className="mt-3 text-lg font-medium text-slate-100">
                  Grow your savings
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Explore interest, fixed deposits, recurring deposits, and other
                  savings calculations.
                </p>
              </div>

              {/* PLANNING */}

              <div className="rounded-xl  border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-600">
                  Planning
                </p>

                <h3 className="mt-3 text-lg font-medium text-slate-100">
                  Plan ahead
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Estimate retirement needs, taxes, returns, and other important
                  financial outcomes.
                </p>
              </div>

            </div>

            <div className="mt-8 border-l border-teal-500/40 pl-4">
              <p className="text-sm leading-7 text-slate-500">
                Built for practical decisions, not complicated spreadsheets.
                <span className="text-slate-300">
                  {" "}Choose a calculator, enter your numbers, and understand the result.
                </span>
              </p>
            </div>

          </div>
        </section>

        {/* ================= LEARNING + COMMUNITY ================= */}

        <section className="border-y border-[#26302F] bg-[#141B1A]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.18em] text-teal-400">
                Learn something. Then talk about it.
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-slate-100">
                Knowledge becomes useful when you put it into practice.
              </h2>
            </div>

            <div className="mt-12 -mb-10 grid gap-5 lg:grid-cols-[1.85fr_1fr]">
              {/* LEARNING — 65% */}

              <div className="rounded-2xl  border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mt-2 text-xl font-medium text-slate-100">
                      Learning
                    </h3>
                  </div>

                  <button
                    onClick={() => navigate("/learning")}
                    className="text-sm text-teal-400 hover:text-teal-300"
                  >
                    Explore →
                  </button>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="rounded-lg border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] px-5 py-4">
                    <p className="text-sm text-slate-200">
                      Understanding mutual funds
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] px-5 py-4">
                    <p className="text-sm text-slate-200">
                      Building an emergency fund
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] px-5 py-4">
                    <p className="text-sm text-slate-200">
                      Understanding credit scores
                    </p>
                  </div>
                </div>
              </div>

              {/* COMMUNITY — 35% */}

              <div className="rounded-2xl border border-[#24302D] transition-colors hover:border-teal-700/40 bg-[#151D1C] p-7">
                <h3 className="mt-2 text-xl font-medium text-slate-100">
                  Community
                </h3>

                <div className="mt-7 rounded-lg border border-[#293533] bg-[#1B2422] p-5">
                  <p className="text-sm leading-6 text-slate-300">
                    “How did you start saving for your first emergency fund?”
                  </p>

                  <p className="mt-4 text-xs text-slate-500">24 replies</p>
                </div>

                <button
                  onClick={() => navigate("/learning")}
                  className="mt-6 text-sm text-teal-400 hover:text-teal-300"
                >
                  Join the discussion →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="border-t border-[#293432] pt-12">
            <p className="text-sm uppercase tracking-[0.18em] text-teal-400">
              Your starting point
            </p>

            <div className="mt-4 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-slate-100 md:text-4xl">
                You don't have to have it all figured out. You just need
                somewhere good to start.
              </h2>

              <button
                onClick={() => navigate("/register")}
                className="shrink-0 rounded-lg bg-teal-500 px-6 py-3 text-sm font-semibold text-[#0E1514] transition hover:bg-teal-400"
              >
                Start with Arventra →
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-[#26302F]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Arventra</p>

          <div className="flex gap-6">
            <button
              onClick={() => navigate("/learning")}
              className="hover:text-slate-300"
            >
              Learn
            </button>

            <button
              onClick={() => navigate("/community")}
              className="hover:text-slate-300"
            >
              Community
            </button>

            <button
              onClick={() => navigate("/calculators")}
              className="hover:text-slate-300"
            >
              Calculators
            </button>

            <button
              onClick={() => navigate("/login")}
              className="hover:text-slate-300"
            >
              Sign in
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
