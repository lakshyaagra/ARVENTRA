import api from "../api/axios";

const calculate = async (endpoint, params) => {
  const response = await api.get(endpoint, {
    params,
  });
  return response.data;
};

const calculatorService = {calculate};
export default calculatorService;