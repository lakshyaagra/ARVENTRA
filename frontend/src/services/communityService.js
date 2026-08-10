import api from "../api/axios";

// ===============================
// DISCUSSIONS
// ===============================

export const getDiscussions = async (params = {}) => {
    const response = await api.get("/community", {params});
    return response.data;
};

export const createDiscussion = async (data) => {
    const response = await api.post("/community", data);
    return response.data;
};

export const updateDiscussion = async (id, data) => {
    const response = await api.patch(`/community/${id}`, data);
    return response.data;
};

export const deleteDiscussion = async (id) => {
    const response = await api.delete(`/community/${id}`);
    return response.data;
};

// ===============================
// COMMENTS
// ===============================

export const getComments = async (discussionId) => {
    const response = await api.get(`/community/${discussionId}/comments`);
    return response.data;
};

export const createComment = async (discussionId, data) => {
    const response = await api.post(`/community/${discussionId}/comments`,data);
    return response.data;
};

export const updateComment = async (commentId, data) => {
    const response = await api.patch(`/community/comments/${commentId}`,data);
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/community/comments/${commentId}`);
    return response.data;
};

// ===============================
// LIKES
// ===============================

export const toggleLike = async (discussionId) => {
    const response = await api.post(`/community/${discussionId}/like`);
    return response.data;
};