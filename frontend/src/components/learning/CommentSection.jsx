import { useEffect, useState } from "react";

import { getComments,createComment } from "../../services/communityService";

const CommentSection = ({ discussionId, onDiscussionUpdate }) => {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadComments = async () => {
        try {
            setLoading(true);
            const response = await getComments(discussionId);
            if (response.success) {
                setComments(response.comments);
            }
        } catch(error){
            console.error(
                error.response?.data?.message ||
                "Unable to load comments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [discussionId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const value = comment.trim();
        if (!value) return;

        try {
            setSubmitting(true);
            const response = await createComment(
                discussionId,
                {
                    comment: value
                }
            );
            if (response.success) {
                setComments((previous) => [
                    response.comment,
                    ...previous
                ]);
                setComment("");
                if (onDiscussionUpdate) {
                    onDiscussionUpdate();
                }
            }
        }catch(error){
            console.error(
                error.response?.data?.message ||
                "Unable to add comment."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-5 border-l border-[#293432] pl-4">

            {/* COMMENT INPUT */}
            <form
                onSubmit={handleSubmit}
                className="flex gap-2"
            >
                <input
                    type="text"
                    value={comment}
                    onChange={(event) =>
                        setComment(event.target.value)
                    }
                    maxLength={300}
                    placeholder="Add a comment..."
                    className="min-w-0 flex-1 rounded-lg border border-[#293432] bg-[#151D1C] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-500"
                />
                <button
                    type="submit"
                    disabled={submitting || !comment.trim()}
                    className="rounded-lg bg-teal-500 px-3 py-2 text-xs font-medium text-[#0E1514] transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {submitting ? "..." : "Post"}
                </button>
            </form>

            {/* COMMENTS */}
            <div className="mt-5">
                {loading ? (
                    <p className="text-xs text-slate-600">
                        Loading comments...
                    </p>
                ) : comments.length === 0 ? (
                    <p className="text-xs text-slate-600">
                        No comments yet. Start the discussion.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((item) => (
                            <div key={item._id}>
                                <p className="text-xs font-medium text-slate-300">
                                    {item.user?.name || "User"}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    {item.comment}
                                </p>
                                {item.isEdited && (
                                    <span className="mt-1 block text-[10px] text-slate-700">
                                        edited
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
