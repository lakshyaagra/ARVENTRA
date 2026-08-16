import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import aiService from "../../services/aiService";

const initialState = {
    messages: [],
    sending: false,
    error: null,
    isOpen: false,

    conversations: [],
    conversationsLoading: false,

    conversationLoading: false,
    conversationId: null,
};

/* ================================================================
   SEND MESSAGE
================================================================ */
export const sendAIMessage = createAsyncThunk(
    "ai/sendAIMessage",

    async ({ message, conversationId }, thunkAPI) => {
        try {
            const response = await aiService.chatWithAI({
                message,
                conversationId,
            });

            return {
                userMessage: message,
                assistantMessage: response.reply,
                conversationId: response.conversationId,
                title: response.title,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Unable to connect to Arventra AI."
            );
        }
    }
);

/* ================================================================
   FETCH RECENT CONVERSATIONS
================================================================ */
export const fetchAIConversations = createAsyncThunk(
    "ai/fetchAIConversations",

    async (_, thunkAPI) => {
        try {
            const response = await aiService.getConversations();

            return response.conversations;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load conversations."
            );
        }
    }
);

/* ================================================================
   LOAD CONVERSATION
================================================================ */
export const loadAIConversation = createAsyncThunk(
    "ai/loadAIConversation",

    async (conversationId, thunkAPI) => {
        try {
            const response =
                await aiService.getConversationById(conversationId);

            return response.conversation;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load conversation."
            );
        }
    }
);

/* ================================================================
   SLICE
================================================================ */
const aiSlice = createSlice({
    name: "ai",
    initialState,
    reducers: {
        openAI(state) {
            state.isOpen = true;
        },
        closeAI(state) {
            state.isOpen = false;
        },
        clearAIConversation(state) {
            state.messages = [];
            state.error = null;
            state.conversationId = null;
        },
    },

    extraReducers: (builder) => {
        builder
            /* ======================================================
               SEND MESSAGE
            ====================================================== */

            .addCase(sendAIMessage.pending, (state) => {
                state.sending = true;
                state.error = null;
            })

            .addCase(sendAIMessage.fulfilled, (state, action) => {
                state.sending = false;
                state.conversationId = action.payload.conversationId;
                state.messages.push({
                    role: "user",
                    content: action.payload.userMessage,
                });
                state.messages.push({
                    role: "assistant",
                    content: action.payload.assistantMessage,
                });

                 const conversationIndex = state.conversations.findIndex(
                    (conversation) =>
                        conversation._id === action.payload.conversationId
                );

                if (conversationIndex !== -1) {
                    // Existing conversation → move it to the top
                    const conversation =
                        state.conversations[conversationIndex];

                    state.conversations.splice(conversationIndex, 1);

                    state.conversations.unshift({
                        ...conversation,
                        updatedAt: new Date().toISOString(),
                    });
                } else {
                    // New conversation → add it to the top
                    state.conversations.unshift({
                        _id: action.payload.conversationId,
                        title: action.payload.title || "New Conversation",
                        updatedAt: new Date().toISOString(),
                    });
                }
                // Keep only the latest 20
                state.conversations = state.conversations.slice(0, 20);
            })
            .addCase(sendAIMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;
            })

            /* ======================================================
               FETCH CONVERSATIONS
            ====================================================== */
            .addCase(fetchAIConversations.pending, (state) => {
                state.conversationsLoading = true;
            })
            .addCase(
                fetchAIConversations.fulfilled,
                (state, action) => {
                    state.conversationsLoading = false;
                    state.conversations = action.payload;
                }
            )
            .addCase(
                fetchAIConversations.rejected,
                (state, action) => {
                    state.conversationsLoading = false;
                    state.error = action.payload;
                }
            )

            /* ======================================================
               LOAD CONVERSATION
            ====================================================== */
            .addCase(loadAIConversation.pending, (state) => {
                state.conversationLoading = true;
                state.error = null;
            })
            .addCase(
                loadAIConversation.fulfilled, (state, action) => {
                    state.conversationLoading = false;

                    state.conversationId =
                        action.payload._id;

                    state.messages =
                        action.payload.messages.map((message) => ({
                                role: message.role,
                                content: message.content,
                            })
                        );
                }
            )
            .addCase(
                loadAIConversation.rejected,
                (state, action) => {
                    state.conversationLoading = false;
                    state.error = action.payload;
                }
            );
    },
});
export const {
    openAI,
    closeAI,
    clearAIConversation,
} = aiSlice.actions;
export default aiSlice.reducer;