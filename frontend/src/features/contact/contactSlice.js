import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import contactService from "../../services/contactService";


export const fetchContacts = createAsyncThunk(
    "contact/fetchContacts",
    async (_, thunkAPI) => {
        try {
            return await contactService.getMyContacts();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load contact requests."
            );
        }
    }
);


export const createContact = createAsyncThunk(
    "contact/createContact",
    async (contactData, thunkAPI) => {
        try {
            return await contactService.createContact(
                contactData
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to submit your message."
            );
        }
    }
);


export const deleteContact = createAsyncThunk(
    "contact/deleteContact",
    async (id, thunkAPI) => {
        try {
            return await contactService.deleteContact(id);

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete contact request."
            );
        }
    }
);


const initialState = {

    contacts: [],

    loading: false,
    creating: false,
    deleting: false,

    error: null,
    createError: null,
    deleteError: null,

    createSuccess: false,
};


const contactSlice = createSlice({

    name: "contact",

    initialState,

    reducers: {

        clearContactErrors: (state) => {
            state.error = null;
            state.createError = null;
            state.deleteError = null;
        },

        clearCreateSuccess: (state) => {
            state.createSuccess = false;
        },

    },


    extraReducers: (builder) => {

        builder

            // =========================================================
            // FETCH
            // =========================================================

            .addCase(fetchContacts.pending, (state) => {

                state.loading = true;
                state.error = null;

            })


            .addCase(fetchContacts.fulfilled, (state, action) => {

                state.loading = false;

                state.contacts =
                    action.payload.contacts || [];

            })


            .addCase(fetchContacts.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            })


            // =========================================================
            // CREATE
            // =========================================================

            .addCase(createContact.pending, (state) => {

                state.creating = true;

                state.createError = null;
                state.createSuccess = false;

            })


            .addCase(createContact.fulfilled, (state, action) => {

                state.creating = false;

                state.createSuccess = true;

                if (action.payload.contact) {

                    state.contacts.unshift(
                        action.payload.contact
                    );

                }

            })


            .addCase(createContact.rejected, (state, action) => {

                state.creating = false;

                state.createError = action.payload;

            })


            // =========================================================
            // DELETE
            // =========================================================

            .addCase(deleteContact.pending, (state) => {

                state.deleting = true;

                state.deleteError = null;

            })


            .addCase(deleteContact.fulfilled, (state, action) => {

                state.deleting = false;

                const deletedId = action.meta.arg;

                state.contacts =
                    state.contacts.filter(
                        (contact) =>
                            contact._id !== deletedId
                    );

            })


            .addCase(deleteContact.rejected, (state, action) => {

                state.deleting = false;

                state.deleteError = action.payload;

            });

    },

});


export const {
    clearContactErrors,
    clearCreateSuccess,
} = contactSlice.actions;


export default contactSlice.reducer;