import axios from "axios";

const API_URL = "http://localhost:5000/api/chats/paginate";

export const fetchChats = async ({ page = 1, per_page = 5, excludeIds = [], search = "" }) => {
  const res = await axios.post(API_URL, { page, per_page, excludeIds, search });
  return res.data;
};
