import api from "../api/axios";

/* ============================================================
GET GOALS
Supports:

* pagination
* sorting
* status filtering
* searching
  ============================================================ */

const getGoals = async ({
    page = 1,
    limit = 15,
    sort = "createdAt",
    order = "desc",
    status,
    search,
} = {}) => {
    const response = await api.get("/goals", {
        params: {
            page,
            limit,
            sort,
            order,
            ...(status ? { status } : {}),
            ...(search ? { search } : {}),
        },
    });

    return response.data;

};

/* ============================================================
GET GOAL BY ID
============================================================ */

const getGoalById = async (id) => {

    const response = await api.get(`/goals/${id}`);

    return response.data;

};

/* ============================================================
CREATE GOAL
Uses FormData because the backend supports goalImage.
============================================================ */

const createGoal = async (goalData) => { 
    console.log("GOAL DATA RECEIVED BY SERVICE:", goalData);
    // If the caller already created FormData, 
    // DO NOT rebuild it using Object.entries(). 
    if (!(goalData instanceof FormData)) { 
        throw new Error("createGoal expected FormData."); 
    } 
    // Debug FormData contents 
    for (const [key, value] of goalData.entries()) { 
        console.log( 
            "FORM DATA:", 
            key, 
            value instanceof File 
            ? {
                name: value.name, 
                type: value.type, 
                size: value.size, 
            } : value 
        ); 
    } 
    const response = await api.post("/goals", goalData); 
    return response.data; 
};

/* ============================================================
UPDATE GOAL
============================================================ */

const updateGoal = async (id, goalData) => { 
    let payload = goalData; 
    if (!(goalData instanceof FormData)) { 
        const formData = new FormData(); 
        Object.entries(goalData).forEach(([key, value]) => { 
            if (value !== undefined && value !== null) { 
                formData.append(key, value); 
            } 
        }); 
        payload = formData; 
    } 
    const response = await api.put(`/goals/${id}`, payload); 
    return response.data; 
};

/* ============================================================
DELETE GOAL
============================================================ */

const deleteGoal = async (id) => {
    const response = await api.delete(`/goals/${id}`);

    return response.data;

};

export default { getGoals, getGoalById, createGoal, updateGoal, deleteGoal };