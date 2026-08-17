import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ARVENTRA from "../assets/ARVENTRA.png"

import FinanceArticle from "../components/learning&community/FinanceArticle";
import CommunityPanel from "../components/learning&community/CommunityPanel";

import financeTopics from "../data/financeTopics";

const Learning = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [showAllTopics, setShowAllTopics] = useState(false);

  const selectedTopicId = searchParams.get("topic") || "mutual-funds";

  const selectedTopic = useMemo(
    () =>
      financeTopics.find(
        (topic) => topic.id === selectedTopicId
      ) || financeTopics[0],
    [selectedTopicId]
  );

  const filteredTopics = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) {
      return financeTopics;
    }
    return financeTopics.filter((topic) => {
      return (
        topic.title.toLowerCase().includes(value) ||
        topic.category.toLowerCase().includes(value)
      );
    });
  }, [search]);

  /*
   * Show only a small number initially.
   * The exact number can be changed later depending
   * on how the UI looks on your screen.
   */

  const visibleTopics = showAllTopics ? filteredTopics : filteredTopics.slice(0, 4);

  const handleTopicSelect = (topicId) => {
    setSearchParams({ topic: topicId });
  };

  return (
    <div className="min-h-screen bg-[#111817] text-white">

      {/* ================= NAVBAR ================= */}

      <header className="left-0 top-0 z-50 w-full border-b border-white/10 bg-[#111817]/40 backdrop-blur-[30px] backdrop-saturate-200">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-0">

          <div className="flex cursor-pointer gap-0 items-center justify-center h-28" onClick={() => navigate("/")}>
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
              className="text-teal-400"
            >
              Learn
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


      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-6 pb-10 pt-32">

        {/* ================= PAGE HEADER ================= */}

        <section className="mb-8 max-w-3xl">

          <p className="text-xs uppercase tracking-[0.18em] text-teal-400">
            Arventra knowledge
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-slate-100 md:text-4xl">
            Understand money. Ask questions. Make better decisions.
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400 md:text-base">
            Explore financial concepts in plain language and see how other
            people are thinking about the same questions.
          </p>

        </section>


        {/* ================= SEARCH ================= */}
        <div className="mb-10">
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowAllTopics(true);
            }}
            placeholder="Search financial topics..."
            className="w-full max-w-xl rounded-lg border border-[#293432] bg-[#151D1C] px-5 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500"
          />
        </div>

        {/* ================= 65 / 35 ================= */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">

          {/* ================= LEFT 65% ================= */}

          <section className="min-w-0">

            {/* TOPIC HEADER */}
            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">
                Topics
              </h2>

              <span className="text-xs text-slate-600">
                {filteredTopics.length} topics
              </span>

            </div>


            {/* ================= TOPIC GRID ================= */}

            <div className="mb-8">

              <div
                className={`grid gap-2 ${
                  showAllTopics
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-4"
                }`}
              >

                {visibleTopics.map((topic) => (

                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleTopicSelect(topic.id)}
                    className={`min-w-0 rounded-lg border px-2 py-2 text-left text-xs transition ${
                      selectedTopicId === topic.id
                        ? "border-teal-500/50 bg-teal-500/10 text-teal-400"
                        : "border-[#293432] bg-[#151D1C] text-slate-500 hover:border-[#40504D] hover:bg-[#18211F] hover:text-slate-300"
                    }`}
                  >
                    <span className="block truncate">
                      {topic.title}
                    </span>

                    <span
                      className={`mt-1 block truncate text-[10px] ${
                        selectedTopicId === topic.id
                          ? "text-teal-500/70"
                          : "text-slate-700"
                      }`}
                    >
                      {topic.category}
                    </span>
                  </button>

                ))}

              </div>


              {/* ================= EXPAND BUTTON ================= */}

              {filteredTopics.length > 4 && (

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllTopics((previous) => !previous)
                    }
                    className="group flex items-center gap-2 rounded-full border border-[#293432] bg-[#151D1C] px-4 py-2 text-xs text-slate-500 transition hover:border-[#40504D] hover:text-slate-300"
                  >
                    <span>
                      {showAllTopics
                        ? "Show less"
                        : `Show all ${filteredTopics.length} topics`}
                    </span>
                    <span
                      className={`text-sm transition-transform ${
                        showAllTopics
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      ↓
                    </span>
                  </button>
                </div>
              )}
            </div>
            {/* ================= ARTICLE ================= */}

            <div className="border-t border-[#293432] pt-10">

              <FinanceArticle topic={selectedTopic} />

            </div>

          </section>


          {/* ================= RIGHT 35% ================= */}

          <CommunityPanel />

        </div>

      </main>

    </div>
  );
};

export default Learning;
