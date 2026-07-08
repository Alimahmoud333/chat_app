import { createContext, useContext, useReducer } from "react";
import API from "../api/axios";
import groupReducer from "../reducers/groupReducer";

const GroupContext = createContext(null);
const GroupDispatchContext = createContext(null);

const initialState = {
  groups: JSON.parse(localStorage.getItem("chat_groups")) || [],

  selectedGroup:
    JSON.parse(localStorage.getItem("chat_selected_group")) || null,

  messages: {},

  loading: false,

  sending: false,

  error: null,
};

export default function GroupProvider({ children }) {
  const [state, dispatch] = useReducer(groupReducer, initialState);

  /*
  ==========================
  GET MY GROUPS
  ==========================
  */

  async function getGroups() {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const res = await API.get("/groups/my-groups");

      const groups = res.data.groups?.data || res.data.groups || [];

      dispatch({
        type: "SET_GROUPS",
        payload: groups,
      });

      return groups;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to load groups",
      });

      throw error;
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  }

  /*
  ==========================
  CREATE GROUP
  ==========================
  */

  async function createGroup(data) {
    try {
      const res = await API.post("/groups/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({
        type: "ADD_GROUP",
        payload: res.data.group,
      });

      return res.data;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to create group",
      });

      throw error;
    }
  }

  /*
  ==========================
  GET GROUP DETAILS
  ==========================
  */

  async function getGroupDetails(groupId) {
    try {
      const res = await API.get(`/groups/${groupId}`);

      dispatch({
        type: "SET_SELECTED_GROUP",
        payload: res.data.group,
      });

      return res.data.group;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || "Failed to load group details",
      });

      throw error;
    }
  }

  /*
  ==========================
  GET GROUP MESSAGES
  ==========================
  */

  async function getGroupMessages(groupId) {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const cached = localStorage.getItem(`chat_group_messages_${groupId}`);

      if (cached) {
        dispatch({
          type: "SET_GROUP_MESSAGES",
          payload: {
            groupId,
            messages: JSON.parse(cached),
          },
        });
      }

      const res = await API.get(`/groups/${groupId}/messages`);

      const messages = res.data.messages?.data || res.data.messages || [];

      dispatch({
        type: "SET_GROUP_MESSAGES",
        payload: {
          groupId,
          messages,
        },
      });

      return messages;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || "Failed to load group messages",
      });

      throw error;
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  }

  /*
  ==========================
  SEND GROUP MESSAGE
  ==========================
  */

  async function sendGroupMessage(groupId, data) {
    try {
      dispatch({
        type: "SET_SENDING",
        payload: true,
      });

      const isFormData = data instanceof FormData;

      const res = await API.post(`/groups/${groupId}/messages`, data, {
        headers: isFormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {},
      });

      dispatch({
        type: "ADD_GROUP_MESSAGE",
        payload: {
          groupId,
          message: res.data.message,
        },
      });

      return res.data;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || "Failed to send group message",
      });

      throw error;
    } finally {
      dispatch({
        type: "SET_SENDING",
        payload: false,
      });
    }
  }

  /*
  ==========================
  ADD MEMBER
  ==========================
  */

  async function addMember(groupId, userId) {
    const res = await API.post(`/groups/${groupId}/members`, {
      user_id: userId,
    });

    await getGroupDetails(groupId);

    return res.data;
  }

  /*
  ==========================
  REMOVE MEMBER
  ==========================
  */

  async function removeMember(groupId, userId) {
    const res = await API.delete(`/groups/${groupId}/members/${userId}`);

    dispatch({
      type: "REMOVE_GROUP_MEMBER",
      payload: {
        groupId,
        userId,
      },
    });

    return res.data;
  }

  /*
  ==========================
  DELETE GROUP
  ==========================
  */

  async function deleteGroup(groupId) {
    const res = await API.delete(`/groups/${groupId}`);

    dispatch({
      type: "DELETE_GROUP",
      payload: groupId,
    });

    return res.data;
  }

  return (
    <GroupContext.Provider
      value={{
        ...state,
        getGroups,
        createGroup,
        getGroupDetails,
        getGroupMessages,
        sendGroupMessage,
        addMember,
        removeMember,
        deleteGroup,
      }}>
      <GroupDispatchContext.Provider value={dispatch}>
        {children}
      </GroupDispatchContext.Provider>
    </GroupContext.Provider>
  );
}

export function useGroup() {
  return useContext(GroupContext);
}

export function useGroupDispatch() {
  return useContext(GroupDispatchContext);
}
