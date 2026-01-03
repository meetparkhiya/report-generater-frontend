import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        list: [],
        ids: [],
        loading: false,
        search: "",
        hasMore: true,
        page: 0,
    },
    reducers: {
        startLoading: (state) => {
            state.loading = true;
        },
        stopLoading: (state) => {
            state.loading = false;
        },
        resetChats: (state, action) => {
            state.list = [];
            state.ids = [];
            state.page = 0;
            state.hasMore = true;
            state.search = action.payload || "";
        },
        addChats: (state, action) => {
            const { data, hasMore } = action.payload;
            data.forEach((chat) => {
                if (!state.ids.includes(chat._id)) {
                    state.list.push(chat);
                    state.ids.push(chat._id);
                }
            });
            state.hasMore = hasMore;
            state.page += 1;
        },
    },
});

export const { startLoading, stopLoading, resetChats, addChats } = chatSlice.actions;
export default chatSlice.reducer;
