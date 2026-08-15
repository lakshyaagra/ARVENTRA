import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import aiService from "../../services/aiService";

const initialState = {
    messages: [],
    sending: false,
    error: null,
    isOpen: false,
};

export const sendAIMessage = createAsyncThunk(
    "ai/sendAIMessage",
    async (message, thunkAPI) => {
        try {
            const response = await aiService.chatWithAI(message);

            return {
                userMessage: message,
                assistantMessage: response.reply,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Unable to connect to Arventra AI."
            );
        }
    }
);

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
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(sendAIMessage.pending, (state) => {
                state.sending = true;
                state.error = null;
            })

            .addCase(sendAIMessage.fulfilled, (state, action) => {
                state.sending = false;

                state.messages.push({
                    role: "user",
                    content: action.payload.userMessage,
                });

                state.messages.push({
                    role: "assistant",
                    content: action.payload.assistantMessage,
                });
            })

            .addCase(sendAIMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;
            });
    },
});

export const {
    openAI,
    closeAI,
    clearAIConversation,
} = aiSlice.actions;

export default aiSlice.reducer;