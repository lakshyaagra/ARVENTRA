import api from "../api/axios";

const createContact = async (contactData) => {
    const response = await api.post(
        "/contact",
        contactData
    );

    return response.data;
};


const getMyContacts = async () => {
    const response = await api.get("/contact");

    return response.data;
};


const deleteContact = async (id) => {
    const response = await api.delete(
        `/contact/${id}`
    );

    return response.data;
};


export default {
    createContact,
    getMyContacts,
    deleteContact,
};