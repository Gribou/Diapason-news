import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import api from "api";

const initialState = { message: "" };

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    displayMessage(state, action) {
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          api.endpoints.logout.matchFulfilled,
          api.endpoints.logout.matchRejected
        ),
        (state) => {
          state.message = "Vous avez été déconnecté.";
        }
      )
      .addMatcher(api.endpoints.ssoLogin.matchRejected, (state, action) => {
        state.message = action?.payload?.non_field_errors;
      })
      .addMatcher(
        api.endpoints.markPageAsRead.matchFulfilled,
        (state, { payload }) => {
          if (payload?.length)
            state.message = `${payload?.length} documents marqués comme lu`;
          else state.message = "Cette page était déjà entièrement lue";
        }
      )
      .addMatcher(api.endpoints.createEditorDoc.matchFulfilled, (state) => {
        state.message = "Nouvelle publication enregistrée";
      })
      .addMatcher(api.endpoints.updateEditorDoc.matchFulfilled, (state) => {
        state.message = "Modifications enregistrées";
      })
      .addMatcher(api.endpoints.deleteEditorDoc.matchFulfilled, (state) => {
        state.message = "Publication supprimée";
      });
  },
});

export const { displayMessage, clearMessage } = messagesSlice.actions;

export default messagesSlice.reducer;

export const useMessage = () =>
  useSelector((state) => state?.messages?.message);
