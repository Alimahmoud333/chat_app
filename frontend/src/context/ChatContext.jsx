import { createContext, useContext, useReducer } from "react";
import API from "../api/axios";
import chatReducer from "../reducers/chatReducer";

const ChatContext = createContext(null);
const ChatDispatchContext = createContext(null);

const initialState = {
  authUserId: JSON.parse(localStorage.getItem("user"))?.id || null,

  users: JSON.parse(localStorage.getItem("chat_users")) || [],

  conversations: JSON.parse(localStorage.getItem("chat_conversations")) || [],

  selectedUser: JSON.parse(localStorage.getItem("chat_selected_user")) || null,

  messages: {},

  typingUsers: {},

  searchResults: [],

  loading: false,

  sending: false,

  error: null,
};

export default function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  /*
  ==========================
  USERS
  ==========================
  */

  async function getUsers(search = "") {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const res = await API.get("/chat/users", {
        params: {
          search,
        },
      });

      const users = res.data.users?.data || res.data.users || [];

      dispatch({
        type: "SET_USERS",
        payload: users,
      });

      return users;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to load users",
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
  CONVERSATIONS
  ==========================
  */

  async function getConversations() {
    try {
      const res = await API.get("/chat/conversations");

      dispatch({
        type: "SET_CONVERSATIONS",
        payload: res.data.conversations || [],
      });

      return res.data.conversations || [];
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response?.data?.message || "Failed to load conversations",
      });

      throw error;
    }
  }

  /*
  ==========================
  SELECT USER
  ==========================
  */

  function selectUser(user) {
    dispatch({
      type: "SET_SELECTED_USER",
      payload: user,
    });
  }

  /*
  ==========================
  GET MESSAGES
  ==========================
  */

  async function getConversation(userId) {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const cached = localStorage.getItem(`chat_messages_${userId}`);

      if (cached) {
        dispatch({
          type: "SET_MESSAGES",
          payload: {
            userId,
            messages: JSON.parse(cached),
          },
        });
      }

      const res = await API.get(`/chat/conversation/${userId}`);

      const messages = res.data.messages?.data || res.data.messages || [];

      dispatch({
        type: "SET_MESSAGES",
        payload: {
          userId,
          messages,
        },
      });

      return messages;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to load conversation",
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
  SEND MESSAGE
  ==========================
  */

  async function sendMessage(data, selectedUserId) {
    try {
      dispatch({
        type: "SET_SENDING",
        payload: true,
      });

      const isFormData = data instanceof FormData;

      const res = await API.post("/chat/send-message", data, {
        headers: isFormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {},
      });

      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          userId: selectedUserId,
          message: res.data.message,
        },
      });

      await getConversations();

      return res.data;
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to send message",
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
  DELETE MESSAGE
  ==========================
  */

  async function deleteMessage(messageId, userId) {
    const res = await API.delete(`/chat/delete-message/${messageId}`);

    dispatch({
      type: "DELETE_MESSAGE",
      payload: {
        userId,
        messageId,
      },
    });

    await getConversations();

    return res.data;
  }

  /*
  ==========================
  DELETE FOR EVERYONE
  ==========================
  */

  async function deleteForEveryone(messageId, userId) {
    const res = await API.delete(`/chat/delete-for-everyone/${messageId}`);

    dispatch({
      type: "DELETE_FOR_EVERYONE",
      payload: {
        userId,
        messageId,
      },
    });

    await getConversations();

    return res.data;
  }

  /*
  ==========================
  REACT MESSAGE
  ==========================
  */

  async function reactMessage(messageId, reaction, userId) {
    const res = await API.post("/chat/react-message", {
      message_id: messageId,
      reaction,
    });

    dispatch({
      type: "ADD_REACTION",
      payload: {
        userId,
        reaction: res.data.reaction,
      },
    });

    return res.data;
  }

  /*
  ==========================
  TYPING
  ==========================
  */

  async function sendTyping(receiverId) {
    await API.post("/chat/typing", {
      receiver_id: receiverId,
    });
  }

  /*
  ==========================
  SEARCH
  ==========================
  */

  async function searchMessages(search, userId = null) {
    const res = await API.post("/chat/search-messages", {
      search,
      user_id: userId,
    });

    const messages = res.data.messages?.data || res.data.messages || [];

    dispatch({
      type: "SET_SEARCH_RESULTS",
      payload: messages,
    });

    return messages;
  }

  /*
==========================
CHAT SETTINGS
==========================
*/

  async function pinChat(userId) {
    const res = await API.post(`/chat-settings/${userId}/pin`);

    await getConversations();

    return res.data;
  }

  async function unpinChat(userId) {
    const res = await API.post(`/chat-settings/${userId}/unpin`);

    await getConversations();

    return res.data;
  }

  async function archiveChat(userId) {
    const res = await API.post(`/chat-settings/${userId}/archive`);

    await getConversations();

    return res.data;
  }

  async function unarchiveChat(userId) {
    const res = await API.post(`/chat-settings/${userId}/unarchive`);

    await getConversations();

    return res.data;
  }

  async function muteChat(userId) {
    const res = await API.post(`/chat-settings/${userId}/mute`);

    await getConversations();

    return res.data;
  }

  async function unmuteChat(userId) {
    const res = await API.post(`/chat-settings/${userId}/unmute`);

    await getConversations();

    return res.data;
  }

  async function blockUser(userId) {
    const res = await API.post(`/chat-settings/${userId}/block`);

    await getConversations();

    return res.data;
  }

  async function unblockUser(userId) {
    const res = await API.post(`/chat-settings/${userId}/unblock`);

    await getConversations();

    return res.data;
  }

  return (
    <ChatContext.Provider
      value={{
        ...state,
        getUsers,
        getConversations,
        selectUser,
        getConversation,
        sendMessage,
        deleteMessage,
        deleteForEveryone,
        reactMessage,
        sendTyping,
        searchMessages,

        pinChat,
        unpinChat,
        archiveChat,
        unarchiveChat,
        muteChat,
        unmuteChat,
        blockUser,
        unblockUser,
      }}>
      <ChatDispatchContext.Provider value={dispatch}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}

export function useChatDispatch() {
  return useContext(ChatDispatchContext);
}
