import { useNavigate } from "react-router-dom";

import financeTopics from "../../data/financeTopics";

const FinanceArticle = ({ topic }) => {
  const navigate = useNavigate();

  if (!topic) {
    return (
      <div className="rounded-xl border border-[#293432] bg-[#151D1C] p-8">
        <p className="text-sm text-slate-500">
          Select a topic to start learning.
        </p>
      </div>
    );
  }

  const relatedTopics = topic.relatedTopics
    ?.map((topicId) =>
      financeTopics.find((item) => item.id === topicId)
    )
    .filter(Boolean);

  const handleRelatedTopic = (topicId) => {
    navigate(`/learning?topic=${topicId}`);
  };

  return (
    <article className="min-w-0">

      {/* ================= ARTICLE HEADER ================= */}

      <header className="border-b border-[#293432] pb-8">

        <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal-400">
          {topic.category}
        </p>

        <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-100 md:text-4xl">
          {topic.title}
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400">
          {topic.description}
        </p>

      </header>


      {/* ================= ARTICLE CONTENT ================= */}

      <div className="py-10">

        {topic.sections?.map((section, index) => (
          <section
            key={`${topic.id}-${index}`}
            className="mb-10 last:mb-0"
          >
            <h2 className="text-xl font-semibold text-slate-100">
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs?.map((paragraph, paragraphIndex) => (
                <p
                  key={`${topic.id}-${index}-${paragraphIndex}`}
                  className="max-w-3xl text-sm leading-8 text-slate-400 md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ================= RELATED TOPICS ================= */}
      {relatedTopics?.length > 0 && (
        <section className="border-t border-[#293432] pt-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Continue exploring
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {relatedTopics.map((relatedTopic) => (
              <button
                key={relatedTopic.id}
                type="button"
                onClick={() => handleRelatedTopic(relatedTopic.id)}
                className="group rounded-xl border border-[#293432] bg-[#151D1C] p-5 text-left transition hover:border-teal-500/40 hover:bg-[#18211F]"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-slate-600 transition group-hover:text-teal-500">
                  {relatedTopic.category}
                </p>
                <h3 className="mt-2 text-sm font-medium text-slate-200">
                  {relatedTopic.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">
                  {relatedTopic.description}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default FinanceArticle;