import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import api, { getAccessToken } from "../../api/axios";

const CommunityPanel = () => {
  const [discussions, setDiscussions] = useState([]);

  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showCreate, setShowCreate] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [editingDiscussionId, setEditingDiscussionId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    type: "question",
    category: "other",
    tags: [],
  });

  const [newDiscussion, setNewDiscussion] = useState({
    type: "question",
    title: "",
    content: "",
    category: "other",
    tags: [],
  });

  const [newTag, setNewTag] = useState("");
  const [creating, setCreating] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const isLoggedIn = Boolean(getAccessToken());

  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?._id || user?.id || null;

  const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || error.message || fallback;

  /*
   * =====================================================
   * FETCH DISCUSSIONS
   * =====================================================
   */

  const fetchDiscussions = async (requestedPage = page) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", requestedPage);
      params.set("limit", "10");
      params.set("sort", sort);
      params.set("order", order);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (type) {
        params.set("type", type);
      }

      if (category) {
        params.set("category", category);
      }

      const response = await api.get(
        `/community?${params.toString()}`
      );

      const data = response.data;

      setDiscussions(data.discussions || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Community fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
   * =====================================================
   * FETCH COMMENTS
   * =====================================================
   */

  const fetchComments = async (discussionId) => {
    try {
      setCommentsLoading(true);

      const response = await api.get(
        `/community/${discussionId}/comments`
      );

      const data = response.data;

      setComments(data.comments || []);
    } catch (error) {
      console.error("Comments fetch error:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  /*
   * =====================================================
   * INITIAL LOAD
   * =====================================================
   */

  useEffect(() => {
    fetchDiscussions(1);
  }, []);

  /*
   * =====================================================
   * SEARCH / FILTER CHANGE
   * =====================================================
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchDiscussions(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, type, category, sort, order]);

  /*
   * =====================================================
   * SELECT DISCUSSION
   * =====================================================
   */

  const handleOpenDiscussion = async (discussion) => {
    setSelectedDiscussion(discussion);
    setShowComments(true);
    setNewComment("");

    await fetchComments(discussion._id);
  };

  /*
   * =====================================================
   * CLOSE COMMENTS
   * =====================================================
   */

  const handleCloseComments = () => {
    setSelectedDiscussion(null);
    setComments([]);
    setShowComments(false);
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  /*
   * =====================================================
   * CREATE DISCUSSION
   * =====================================================
   */

  const handleCreateDiscussion = async (event) => {
    event.preventDefault();

    if (!newDiscussion.title.trim()) {
      return;
    }

    if (!newDiscussion.content.trim()) {
      return;
    }

    try {
      setCreating(true);

      const payload = {
        ...newDiscussion,
        title: newDiscussion.title.trim(),
        content: newDiscussion.content.trim(),
        tags: newDiscussion.tags.map((tag) => tag.trim()),
      };

      await api.post(`/community`, payload);

      setNewDiscussion({
        type: "question",
        title: "",
        content: "",
        category: "other",
        tags: [],
      });

      setNewTag("");
      setShowCreate(false);
      setPage(1);

      await fetchDiscussions(1);
    } catch (error) {
      console.error("Create discussion error:", error);
      alert(getErrorMessage(error, "Failed to create discussion."));
    } finally {
      setCreating(false);
    }
  };

  /*
   * =====================================================
   * ADD TAG
   * =====================================================
   */

  const handleAddTag = () => {
    const tag = newTag.trim();

    if (!tag) {
      return;
    }

    if (newDiscussion.tags.length >= 10) {
      return;
    }

    if (newDiscussion.tags.includes(tag)) {
      setNewTag("");
      return;
    }

    setNewDiscussion((previous) => ({
      ...previous,
      tags: [...previous.tags, tag],
    }));

    setNewTag("");
  };

  /*
   * =====================================================
   * REMOVE TAG
   * =====================================================
   */

  const handleRemoveTag = (tagToRemove) => {
    setNewDiscussion((previous) => ({
      ...previous,
      tags: previous.tags.filter(
        (tag) => tag !== tagToRemove
      ),
    }));
  };

  /*
   * =====================================================
   * ADD COMMENT
   * =====================================================
   */

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      alert("Please sign up or log in to comment.");
      return;
    }

    if (!selectedDiscussion) {
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      setCommentSubmitting(true);

      await api.post(
        `/community/${selectedDiscussion._id}/comments`,
        { comment: newComment.trim() }
      );

      setNewComment("");

      await fetchComments(selectedDiscussion._id);

      setDiscussions((previous) =>
        previous.map((discussion) =>
          discussion._id === selectedDiscussion._id
            ? {
              ...discussion,
              commentsCount:
                (discussion.commentsCount || 0) + 1,
            }
            : discussion
        )
      );

      setSelectedDiscussion((previous) =>
        previous
          ? {
            ...previous,
            commentsCount:
              (previous.commentsCount || 0) + 1,
          }
          : previous
      );
    } catch (error) {
      console.error("Add comment error:", error);
      alert(getErrorMessage(error, "Failed to add comment."));
    } finally {
      setCommentSubmitting(false);
    }
  };

  /*
   * =====================================================
   * TOGGLE LIKE
   * =====================================================
   */

  const handleToggleLike = async (
    event,
    discussion
  ) => {
    event.stopPropagation();

    if (!isLoggedIn) {
      alert("Please sign up or log in to like discussions.");
      return;
    }

    try {
      const response = await api.post(
        `/community/${discussion._id}/like`
      );

      const data = response.data;

      const isLiked =
        data.message === "Discussion liked.";

      const updateDiscussionState = (item) => {
        const currentLikes = item.likes || [];
        const updatedLikes = isLiked
          ? [...currentLikes, currentUserId]
          : currentLikes.filter(
              (id) => String(id) !== String(currentUserId)
            );

        return {
          ...item,
          likes: updatedLikes,
          isLiked: isLiked,
          likesCount: Math.max(
            0,
            (item.likesCount || 0) + (isLiked ? 1 : -1)
          ),
        };
      };

      setDiscussions((previous) =>
        previous.map((item) =>
          item._id === discussion._id ? updateDiscussionState(item) : item
        )
      );

      if (
        selectedDiscussion &&
        selectedDiscussion._id === discussion._id
      ) {
        setSelectedDiscussion((previous) =>
          updateDiscussionState(previous)
        );
      }
    } catch (error) {
      console.error("Like error:", error);
      alert(getErrorMessage(error, "Failed to toggle like."));
    }
  };

  /*
   * =====================================================
   * UPDATE COMMENT
   * =====================================================
   */

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentText.trim()) {
      return;
    }

    try {
      const response = await api.patch(
        `/community/comments/${commentId}`,
        { comment: editingCommentText.trim() }
      );

      const data = response.data;

      setComments((previous) =>
        previous.map((comment) =>
          comment._id === commentId
            ? data.comment
            : comment
        )
      );

      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (error) {
      console.error("Update comment error:", error);
      alert(getErrorMessage(error, "Failed to update comment."));
    }
  };

  /*
   * =====================================================
   * DELETE COMMENT
   * =====================================================
   */

  const handleDeleteComment = async (comment) => {
    const shouldDelete = window.confirm(
      "Delete this comment?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await api.delete(`/community/comments/${comment._id}`);

      setComments((previous) =>
        previous.filter(
          (item) => item._id !== comment._id
        )
      );

      if (selectedDiscussion) {
        setSelectedDiscussion((previous) => ({
          ...previous,
          commentsCount: Math.max(
            0,
            (previous.commentsCount || 0) - 1
          ),
        }));

        setDiscussions((previous) =>
          previous.map((discussion) =>
            discussion._id === selectedDiscussion._id
              ? {
                ...discussion,
                commentsCount: Math.max(
                  0,
                  (discussion.commentsCount || 0) - 1
                ),
              }
              : discussion
          )
        );
      }
    } catch (error) {
      console.error("Delete comment error:", error);
      alert(getErrorMessage(error, "Failed to delete comment."));
    }
  };

  /*
   * =====================================================
   * DELETE DISCUSSION
   * =====================================================
   */

  const deleteDiscussion = async (
    event,
    discussionId
  ) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this discussion?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/community/${discussionId}`);

      setDiscussions((current) =>
        current.filter(
          (discussion) =>
            discussion._id !== discussionId
        )
      );

      if (
        selectedDiscussion &&
        selectedDiscussion._id === discussionId
      ) {
        handleCloseComments();
      }
    } catch (error) {
      console.error(
        "Delete discussion error:",
        error
      );

      alert(
        getErrorMessage(
          error,
          "Something went wrong while deleting the discussion."
        )
      );
    }
  };

  /*
   * =====================================================
   * UPDATE DISCUSSION
   * =====================================================
   */

  const updateDiscussion = async (
    discussionId,
    updatedData
  ) => {
    try {
      const response = await api.patch(
        `/community/${discussionId}`,
        {
          ...updatedData,
          title: updatedData.title?.trim(),
          content: updatedData.content?.trim(),
          tags: updatedData.tags?.map((tag) =>
            tag.trim()
          ),
        }
      );

      const data = response.data;

      setDiscussions((current) =>
        current.map((discussion) =>
          discussion._id === discussionId
            ? data.discussion
            : discussion
        )
      );

      if (
        selectedDiscussion &&
        selectedDiscussion._id === discussionId
      ) {
        setSelectedDiscussion(data.discussion);
      }

      return true;
    } catch (error) {
      console.error(
        "Update discussion error:",
        error
      );

      alert(
        getErrorMessage(
          error,
          "Something went wrong while updating the discussion."
        )
      );

      return false;
    }
  };

  /*
   * =====================================================
   * START EDITING DISCUSSION
   * =====================================================
   */

  const startEditing = (event, discussion) => {
    event.stopPropagation();

    setEditingDiscussionId(discussion._id);

    setEditForm({
      title: discussion.title,
      content: discussion.content,
      type: discussion.type,
      category: discussion.category,
      tags: discussion.tags || [],
    });
  };

  /*
   * =====================================================
   * SAVE DISCUSSION EDIT
   * =====================================================
   */

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingDiscussionId) {
      return;
    }

    const success = await updateDiscussion(
      editingDiscussionId,
      editForm
    );

    if (success) {
      setEditingDiscussionId(null);
    }
  };

  /*
   * =====================================================
   * CANCEL DISCUSSION EDIT
   * =====================================================
   */

  const cancelEditing = () => {
    setEditingDiscussionId(null);
  };

  /*
   * =====================================================
   * PAGINATION
   * =====================================================
   */

  const handlePreviousPage = () => {
    if (page <= 1) {
      return;
    }

    const nextPage = page - 1;

    setPage(nextPage);
    fetchDiscussions(nextPage);
  };

  const handleNextPage = () => {
    if (page >= totalPages) {
      return;
    }

    const nextPage = page + 1;

    setPage(nextPage);
    fetchDiscussions(nextPage);
  };

  /*
   * =====================================================
   * HELPERS
   * =====================================================
   */

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "";
    }

    return value.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const truncate = (text, length = 110) => {
    if (!text) {
      return "";
    }

    if (text.length <= length) {
      return text;
    }

    return `${text.slice(0, length)}...`;
  };

  const categoryLabel = (value) => {
    if (!value) {
      return "Other";
    }

    return value
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  const selectedCommentCount = useMemo(() => {
    return comments.length;
  }, [comments]);

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <aside className="min-w-0">
      {/* =====================================================
          COMMUNITY HEADER
      ====================================================== */}

      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-teal-400">
            Community
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-100">
            Discuss finance
          </h2>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Ask questions, share ideas, and learn from
            other people.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isLoggedIn) {
              alert("Please sign up or log in to start a discussion.");
              return;
            }

            setShowCreate(true);
          }}
          className="shrink-0 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-2 text-xs font-medium text-teal-400 transition hover:border-teal-400 hover:bg-teal-500/15"
        >
          + Discuss
        </button>
      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search discussions..."
          className="w-full min-w-0 rounded-lg border border-[#293432] bg-[#151D1C] px-4 py-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500"
        />
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="mb-5 grid grid-cols-2 gap-2">
        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value)
          }
          className="min-w-0 rounded-lg border border-[#293432] bg-[#151D1C] px-3 py-2 text-xs text-slate-400 outline-none focus:border-teal-500"
        >
          <option value="">All types</option>
          <option value="question">Questions</option>
          <option value="blog">Blogs</option>
        </select>

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className="min-w-0 rounded-lg border border-[#293432] bg-[#151D1C] px-3 py-2 text-xs text-slate-400 outline-none focus:border-teal-500"
        >
          <option value="">All categories</option>
          <option value="budgeting">Budgeting</option>
          <option value="saving">Saving</option>
          <option value="investment">
            Investment
          </option>
          <option value="mutual-funds">
            Mutual Funds
          </option>
          <option value="stocks">Stocks</option>
          <option value="insurance">
            Insurance
          </option>
          <option value="loan">Loan</option>
          <option value="tax">Tax</option>
          <option value="credit-score">
            Credit Score
          </option>
          <option value="retirement">
            Retirement
          </option>
          <option value="financial-planning">
            Financial Planning
          </option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* =====================================================
          SORT
      ====================================================== */}

      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-600">
          {loading
            ? "Loading..."
            : `${discussions.length} discussions`}
        </span>

        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            className="max-w-30 rounded-md border border-[#293432] bg-[#151D1C] px-2 py-1.5 text-[11px] text-slate-500 outline-none"
          >
            <option value="createdAt">Latest</option>
            <option value="likesCount">
              Most liked
            </option>
            <option value="commentsCount">
              Most discussed
            </option>
            <option value="views">
              Most viewed
            </option>
            <option value="title">Title</option>
          </select>

          <button
            type="button"
            onClick={() =>
              setOrder((previous) =>
                previous === "desc"
                  ? "asc"
                  : "desc"
              )
            }
            className="rounded-md border border-[#293432] px-2 py-1.5 text-[11px] text-slate-500 transition hover:text-slate-300"
            title="Change sort order"
          >
            {order === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </div>

      {/* =====================================================
          DISCUSSION LIST
      ====================================================== */}

      <div className="min-w-0 space-y-3">
        {loading ? (
          <>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-[#293432] bg-[#121918] p-4"
              >
                <div className="mb-3 h-3 w-20 rounded bg-[#293432]" />
                <div className="mb-2 h-4 w-4/5 rounded bg-[#293432]" />
                <div className="mb-4 h-3 w-full rounded bg-[#293432]" />
                <div className="h-3 w-1/2 rounded bg-[#293432]" />
              </div>
            ))}
          </>
        ) : discussions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#293432] bg-[#121918] px-5 py-8 text-center">
            <p className="text-sm text-slate-500">
              No discussions found.
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-600">
              Try another search or start the first
              discussion.
            </p>

            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  alert("Please sign up or log in to start a discussion.");
                  return;
                }

                setShowCreate(true);
              }}
              className="mt-4 rounded-lg border border-teal-500/30 px-3 py-2 text-xs text-teal-400"
            >
              Start discussion
            </button>
          </div>
        ) : (
          discussions.map((discussion) => {
            const discussionOwnerId =
              discussion.user?._id ||
              discussion.user?.id ||
              discussion.user;

            const isOwner =
              discussionOwnerId &&
              currentUserId &&
              String(discussionOwnerId) ===
              String(currentUserId);

            const isLiked =
              discussion.isLiked ||
              discussion.likes?.some(
                (id) => String(id) === String(currentUserId)
              );

            return (
              <article
                key={discussion._id}
                onClick={() =>
                  handleOpenDiscussion(discussion)
                }
                className="group min-w-0 cursor-pointer rounded-xl border border-[#293432] bg-[#121918] p-4 transition hover:border-[#40504D] hover:bg-[#151D1C]"
              >
                {/* Top row */}

                <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] ${discussion.type === "question"
                          ? "bg-teal-500/10 text-teal-400"
                          : "bg-slate-500/10 text-slate-400"
                        }`}
                    >
                      {discussion.type === "question"
                        ? "Question"
                        : "Blog"}
                    </span>

                    <span className="truncate text-[10px] text-slate-600">
                      {categoryLabel(
                        discussion.category
                      )}
                    </span>
                  </div>

                  <span className="shrink-0 text-[10px] text-slate-600">
                    {formatDate(
                      discussion.createdAt
                    )}
                  </span>
                </div>

                {/* Title */}

                <h3 className="wrap-break-word text-sm font-medium leading-5 text-slate-200 transition group-hover:text-teal-400">
                  {discussion.title}
                </h3>

                {/* Content */}

                <p className="mt-2 wrap-break-word text-xs leading-5 text-slate-500">
                  {truncate(discussion.content)}
                </p>

                {/* User */}

                <div className="mt-4 flex min-w-0 items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#293432] text-[10px] text-slate-400">
                    {discussion.user?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                  <span className="min-w-0 truncate text-[10px] text-slate-500">
                    {discussion.user?.name ||
                      "Community member"}
                  </span>
                </div>

                {/* Stats */}

                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#293432] pt-3">
                  <button
                    type="button"
                    onClick={(event) =>
                      handleToggleLike(
                        event,
                        discussion
                      )
                    }
                    className={`text-[11px] transition ${
                      isLiked
                        ? "font-medium text-teal-400"
                        : "text-slate-500 hover:text-teal-400"
                    }`}
                  >
                    {isLiked ? "♥" : "♡"} {discussion.likesCount || 0}
                  </button>

                  <span className="text-[11px] text-slate-600">
                    💬{" "}
                    {discussion.commentsCount || 0}
                  </span>

                  {discussion.views !==
                    undefined && (
                      <span className="text-[11px] text-slate-600">
                        ◉ {discussion.views}
                      </span>
                    )}

                  {/* OWNER ACTIONS */}

                  {isOwner && (
                    <div
                      className="ml-auto flex items-center gap-2"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <button
                        type="button"
                        onClick={(event) =>
                          startEditing(
                            event,
                            discussion
                          )
                        }
                        className="rounded-md border border-[#293432] px-2 py-1 text-[10px] text-slate-600 transition hover:border-teal-500/40 hover:text-teal-400"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={(event) =>
                          deleteDiscussion(
                            event,
                            discussion._id
                          )
                        }
                        className="rounded-md border border-[#293432] px-2 py-1 text-[10px] text-slate-600 transition hover:border-red-500/40 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* =================================================
                    INLINE EDIT DISCUSSION
                ================================================== */}

                {editingDiscussionId ===
                  discussion._id && (
                    <div
                      className="mt-4 rounded-xl border border-teal-500/20 bg-[#101716] p-4"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <form
                        onSubmit={handleSaveEdit}
                        className="space-y-4"
                      >
                        <div>
                          <label className="mb-2 block text-[10px] text-slate-600">
                            Title
                          </label>

                          <input
                            type="text"
                            value={editForm.title}
                            maxLength={150}
                            onChange={(event) =>
                              setEditForm(
                                (previous) => ({
                                  ...previous,
                                  title:
                                    event.target
                                      .value,
                                })
                              )
                            }
                            className="w-full rounded-lg border border-[#293432] bg-[#151D1C] px-3 py-2 text-xs text-slate-200 outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-[10px] text-slate-600">
                            Content
                          </label>

                          <textarea
                            value={editForm.content}
                            rows={5}
                            onChange={(event) =>
                              setEditForm(
                                (previous) => ({
                                  ...previous,
                                  content:
                                    event.target
                                      .value,
                                })
                              )
                            }
                            className="w-full resize-none rounded-lg border border-[#293432] bg-[#151D1C] px-3 py-2 text-xs leading-5 text-slate-300 outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={editForm.type}
                            onChange={(event) =>
                              setEditForm(
                                (previous) => ({
                                  ...previous,
                                  type: event.target
                                    .value,
                                })
                              )
                            }
                            className="rounded-lg border border-[#293432] bg-[#151D1C] px-3 py-2 text-xs text-slate-400 outline-none focus:border-teal-500"
                          >
                            <option value="question">
                              Question
                            </option>

                            <option value="blog">
                              Blog
                            </option>
                          </select>

                          <select
                            value={editForm.category}
                            onChange={(event) =>
                              setEditForm(
                                (previous) => ({
                                  ...previous,
                                  category:
                                    event.target
                                      .value,
                                })
                              )
                            }
                            className="rounded-lg border border-[#293432] bg-[#151D1C] px-3 py-2 text-xs text-slate-400 outline-none focus:border-teal-500"
                          >
                            <option value="other">
                              Other
                            </option>

                            <option value="budgeting">
                              Budgeting
                            </option>

                            <option value="saving">
                              Saving
                            </option>

                            <option value="investment">
                              Investment
                            </option>

                            <option value="mutual-funds">
                              Mutual Funds
                            </option>

                            <option value="stocks">
                              Stocks
                            </option>

                            <option value="insurance">
                              Insurance
                            </option>

                            <option value="loan">
                              Loan
                            </option>

                            <option value="tax">
                              Tax
                            </option>

                            <option value="credit-score">
                              Credit Score
                            </option>

                            <option value="retirement">
                              Retirement
                            </option>

                            <option value="financial-planning">
                              Financial Planning
                            </option>
                          </select>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="rounded-md border border-[#293432] px-3 py-2 text-[10px] text-slate-600 hover:text-slate-300"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="rounded-md bg-teal-500 px-3 py-2 text-[10px] font-medium text-[#07100F] hover:bg-teal-400"
                          >
                            Save changes
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
              </article>
            );
          })
        )}
      </div>

      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {!loading && discussions.length > 0 && (
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1}
            onClick={handlePreviousPage}
            className="rounded-lg border border-[#293432] px-3 py-2 text-xs text-slate-500 transition hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Previous
          </button>

          <span className="text-[11px] text-slate-600">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={handleNextPage}
            className="rounded-lg border border-[#293432] px-3 py-2 text-xs text-slate-500 transition hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}

      {/* =====================================================
          CREATE DISCUSSION MODAL
      ====================================================== */}

      {showCreate && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div style={{ scrollbarWidth: 'none' }}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-2xl border border-[#293432] bg-[#111817] p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-teal-400">
                  Community
                </p>

                <h3 className="mt-2 text-xl font-semibold text-slate-100">
                  Start a discussion
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Ask a question or share something
                  useful with the community.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreate(false)
                }
                className="text-slate-500 transition hover:text-white"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateDiscussion}
              className="space-y-5"
            >
              {/* Type */}

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Type
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNewDiscussion(
                        (previous) => ({
                          ...previous,
                          type: "question",
                        })
                      )
                    }
                    className={`rounded-lg border px-4 py-3 text-xs ${newDiscussion.type ===
                        "question"
                        ? "border-teal-500/50 bg-teal-500/10 text-teal-400"
                        : "border-[#293432] text-slate-500"
                      }`}
                  >
                    Ask a question
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNewDiscussion(
                        (previous) => ({
                          ...previous,
                          type: "blog",
                        })
                      )
                    }
                    className={`rounded-lg border px-4 py-3 text-xs ${newDiscussion.type === "blog"
                        ? "border-teal-500/50 bg-teal-500/10 text-teal-400"
                        : "border-[#293432] text-slate-500"
                      }`}
                  >
                    Share a blog
                  </button>
                </div>
              </div>

              {/* Title */}

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Title
                </label>

                <input
                  type="text"
                  value={newDiscussion.title}
                  onChange={(event) =>
                    setNewDiscussion(
                      (previous) => ({
                        ...previous,
                        title:
                          event.target.value,
                      })
                    )
                  }
                  maxLength={150}
                  placeholder="What do you want to discuss?"
                  className="w-full rounded-lg border border-[#293432] bg-[#151D1C] px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500"
                />

                <div className="mt-1 text-right text-[10px] text-slate-600">
                  {newDiscussion.title.length}/150
                </div>
              </div>

              {/* Content */}

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Content
                </label>

                <textarea
                  value={newDiscussion.content}
                  onChange={(event) =>
                    setNewDiscussion(
                      (previous) => ({
                        ...previous,
                        content:
                          event.target.value,
                      })
                    )
                  }
                  rows={6}
                  placeholder="Write your question or share your thoughts..."
                  className="w-full resize-none rounded-lg border border-[#293432] bg-[#151D1C] px-4 py-3 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500"
                />

                <div className="mt-1 text-[10px] text-slate-600">
                  Minimum 20 characters
                </div>
              </div>

              {/* Category */}

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Category
                </label>

                <select
                  value={newDiscussion.category}
                  onChange={(event) =>
                    setNewDiscussion(
                      (previous) => ({
                        ...previous,
                        category:
                          event.target.value,
                      })
                    )
                  }
                  className="w-full rounded-lg border border-[#293432] bg-[#151D1C] px-4 py-3 text-xs text-slate-300 outline-none focus:border-teal-500"
                >
                  <option value="other">
                    Other
                  </option>
                  <option value="budgeting">
                    Budgeting
                  </option>
                  <option value="saving">
                    Saving
                  </option>
                  <option value="investment">
                    Investment
                  </option>
                  <option value="mutual-funds">
                    Mutual Funds
                  </option>
                  <option value="stocks">
                    Stocks
                  </option>
                  <option value="insurance">
                    Insurance
                  </option>
                  <option value="loan">Loan</option>
                  <option value="tax">Tax</option>
                  <option value="credit-score">
                    Credit Score
                  </option>
                  <option value="retirement">
                    Retirement
                  </option>
                  <option value="financial-planning">
                    Financial Planning
                  </option>
                </select>
              </div>

              {/* Tags */}

              <div>
                <label className="mb-2 block text-xs text-slate-500">
                  Tags
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(event) =>
                      setNewTag(
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter"
                      ) {
                        event.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag"
                    className="min-w-0 flex-1 rounded-lg border border-[#293432] bg-[#151D1C] px-4 py-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500"
                  />

                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-lg border border-[#293432] px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Add
                  </button>
                </div>

                {newDiscussion.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {newDiscussion.tags.map(
                      (tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() =>
                            handleRemoveTag(
                              tag
                            )
                          }
                          className="rounded-full border border-[#293432] bg-[#151D1C] px-3 py-1 text-[10px] text-slate-400"
                        >
                          #{tag} ×
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}

              <div className="flex justify-end gap-3 border-t border-[#293432] pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(false)
                  }
                  className="rounded-lg border border-[#293432] px-4 py-2.5 text-xs text-slate-500 hover:text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-teal-500 px-5 py-2.5 text-xs font-medium text-[#07100F] transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "Publishing..."
                    : "Publish discussion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DISCUSSION / COMMENTS MODAL
      ====================================================== */}

      {showComments &&
        selectedDiscussion && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#293432] bg-[#111817] shadow-2xl">
              {/* Modal header */}

              <div className="flex items-start justify-between gap-4 border-b border-[#293432] p-6">
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${selectedDiscussion.type ===
                          "question"
                          ? "bg-teal-500/10 text-teal-400"
                          : "bg-slate-500/10 text-slate-400"
                        }`}
                    >
                      {selectedDiscussion.type ===
                        "question"
                        ? "Question"
                        : "Blog"}
                    </span>

                    <span className="text-[10px] text-slate-600">
                      {categoryLabel(
                        selectedDiscussion.category
                      )}
                    </span>
                  </div>

                  <h3 className="wrap-break-word text-xl font-semibold leading-7 text-slate-100">
                    {selectedDiscussion.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600">
                    by{" "}
                    {selectedDiscussion.user?.name ||
                      "Community member"}{" "}
                    ·{" "}
                    {formatDate(
                      selectedDiscussion.createdAt
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseComments}
                  className="shrink-0 text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Modal body */}

              <div className="min-h-0 flex-1 overflow-y-auto p-6">
                {/* Discussion content */}

                <div className="mb-6">
                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-300">
                    {selectedDiscussion.content}
                  </p>
                </div>

                {/* Stats */}

                <div className="mb-7 flex items-center gap-5 border-y border-[#293432] py-4">
                  {(() => {
                    const isSelectedLiked =
                      selectedDiscussion.isLiked ||
                      selectedDiscussion.likes?.some(
                        (id) => String(id) === String(currentUserId)
                      );
                    return (
                      <button
                        type="button"
                        onClick={(event) =>
                          handleToggleLike(
                            event,
                            selectedDiscussion
                          )
                        }
                        className={`text-xs transition ${
                          isSelectedLiked
                            ? "font-medium text-teal-400"
                            : "text-slate-500 hover:text-teal-400"
                        }`}
                      >
                        {isSelectedLiked ? "♥" : "♡"}{" "}
                        {selectedDiscussion.likesCount || 0} likes
                      </button>
                    );
                  })()}

                  <span className="text-xs text-slate-600">
                    💬{" "}
                    {selectedDiscussion.commentsCount || 0} comments
                  </span>
                </div>

                {/* Comments */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-300">
                      Comments
                    </h4>

                    <span className="text-[10px] text-slate-600">
                      {selectedCommentCount}
                    </span>
                  </div>

                  {commentsLoading ? (
                    <p className="py-5 text-center text-xs text-slate-600">
                      Loading comments...
                    </p>
                  ) : comments.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#293432] p-5 text-center">
                      <p className="text-xs text-slate-600">
                        No comments yet.
                      </p>

                      <p className="mt-1 text-[11px] text-slate-700">
                        Be the first to respond.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => {
                        const commentOwnerId = comment.user?._id || comment.user?.id || comment.user;

                        const isCommentOwner =
                          commentOwnerId && currentUserId && String(commentOwnerId) === String(currentUserId);

                        return (
                          <div
                            key={comment._id}
                            className="rounded-xl border border-[#293432] bg-[#121918] p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#293432] text-[10px] text-slate-400">
                                  {comment.user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "U"}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-xs text-slate-400">
                                    {comment.user?.name ||
                                      "Community member"}
                                  </p>

                                  <p className="text-[10px] text-slate-700">
                                    {formatDate(
                                      comment.createdAt
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* Comment owner actions */}
                              {isCommentOwner && (
                                <div className="flex shrink-0 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCommentId(
                                        comment._id
                                      );

                                      setEditingCommentText(
                                        comment.comment
                                      );
                                    }}
                                    className="text-[10px] text-slate-600 hover:text-teal-400"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteComment(
                                        comment
                                      )
                                    }
                                    className="text-[10px] text-slate-600 hover:text-red-400"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>

                            {editingCommentId ===
                              comment._id ? (
                              <div className="mt-3">
                                <textarea
                                  value={
                                    editingCommentText
                                  }
                                  onChange={(event) =>
                                    setEditingCommentText(
                                      event.target
                                        .value
                                    )
                                  }
                                  rows={3}
                                  className="w-full resize-none rounded-lg border border-[#293432] bg-[#151D1C] px-3 py-2 text-xs leading-5 text-slate-300 outline-none focus:border-teal-500"
                                />

                                <div className="mt-2 flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCommentId(
                                        null
                                      );

                                      setEditingCommentText(
                                        ""
                                      );
                                    }}
                                    className="px-3 py-1.5 text-[10px] text-slate-600"
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateComment(
                                        comment._id
                                      )
                                    }
                                    className="rounded-md bg-teal-500 px-3 py-1.5 text-[10px] text-[#07100F]"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="mt-3 whitespace-pre-wrap wrap-break-word text-xs leading-6 text-slate-400">
                                {comment.comment}

                                {comment.isEdited && (
                                  <span className="ml-2 text-[9px] text-slate-700">
                                    edited
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Add comment */}
              <form
                onSubmit={handleAddComment}
                className="border-t border-[#293432] bg-[#111817] p-4"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(event) =>
                      setNewComment(
                        event.target.value
                      )
                    }
                    maxLength={300}
                    placeholder="Write a comment..."
                    className="min-w-0 flex-1 rounded-lg border border-[#293432] bg-[#151D1C] px-4 py-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500"
                  />

                  <button
                    type="submit"
                    disabled={
                      commentSubmitting ||
                      !newComment.trim()
                    }
                    className="shrink-0 rounded-lg bg-teal-500 px-4 py-3 text-xs font-medium text-[#07100F] transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {commentSubmitting
                      ? "..."
                      : "Send"}
                  </button>
                </div>

                <div className="mt-2 text-right text-[9px] text-slate-700">
                  {newComment.length}/300
                </div>
              </form>
            </div>
          </div>
        )}
    </aside>
  );
};

export default CommunityPanel;