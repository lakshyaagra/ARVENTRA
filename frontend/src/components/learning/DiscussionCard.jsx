import { useState } from "react";
import CommentSection from "./CommentSection";
import { toggleLike } from "../../services/communityService";

const DiscussionCard = ({ discussion, onDiscussionUpdate }) => {

    const [showComments, setShowComments] = useState(false);
    const [likesCount, setLikesCount] = useState(
        discussion.likesCount || 0
    );

    const [liked, setLiked] = useState(false);

    const handleLike = async () => {
        try {
            const response = await toggleLike(discussion._id);
            if (response.success) {
                if (response.message === "Discussion liked.") {
                    setLiked(true);
                    setLikesCount((count) => count + 1);
                }
                if (response.message === "Discussion unliked.") {
                    setLiked(false);
                    setLikesCount((count) => Math.max(0, count - 1));   //defends the count going negative
                }
            }
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                "Unable to like discussion."
            );
        }
    };

    return (
        <article className="border-b border-[#293432] py-6">
            {/* TYPE */}
            <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.15em] text-teal-400">
                    {discussion.type}
                </span>
                {discussion.category && (
                    <span className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                        {discussion.category}
                    </span>
                )}
            </div>
            {/* TITLE */}
            <h3 className="mt-2 text-base font-medium leading-6 text-slate-100">
                {discussion.title}
            </h3>
            {/* CONTENT */}
            <p className="mt-3 text-sm leading-6 text-slate-400">
                {discussion.content}
            </p>
            {/* AUTHOR */}
            <div className="mt-4 text-xs text-slate-600">
                {discussion.user?.name || "Arventra user"}
            </div>
            {/* ACTIONS */}
            <div className="mt-5 flex items-center gap-5 text-xs">
                <button
                    onClick={handleLike}
                    className={`transition ${
                        liked
                            ? "text-teal-400"
                            : "text-slate-500 hover:text-teal-400"
                    }`}
                >
                    ♥ {likesCount}
                </button>
                <button
                    onClick={() =>
                        setShowComments((value) => !value)
                    }
                    className="text-slate-500 transition hover:text-slate-300"
                >
                    💬 {discussion.commentsCount || 0}
                </button>
            </div>
            {/* COMMENTS */}
            {showComments && (
                <CommentSection
                    discussionId={discussion._id}
                    onDiscussionUpdate={onDiscussionUpdate}
                />
            )}
        </article>
    );
};

export default DiscussionCard;
