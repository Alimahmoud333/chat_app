export default function chatReducer(state, action) {
  switch (action.type) {
    /*
    ==========================
    USERS
    ==========================
    */

    case "SET_USERS": {
      localStorage.setItem("chat_users", JSON.stringify(action.payload));

      return {
        ...state,
        users: action.payload,
      };
    }

    /*
    ==========================
    CONVERSATIONS
    ==========================
    */

    case "SET_CONVERSATIONS": {
      localStorage.setItem(
        "chat_conversations",
        JSON.stringify(action.payload),
      );

      return {
        ...state,
        conversations: action.payload,
      };
    }

    case "UPSERT_CONVERSATION": {
      const conversation = action.payload;

      const oldConversations = state.conversations || [];

      const exists = oldConversations.some(
        (item) => item.user?.id === conversation.user?.id,
      );

      const updated = exists
        ? oldConversations.map((item) =>
            item.user?.id === conversation.user?.id ? conversation : item,
          )
        : [conversation, ...oldConversations];

      localStorage.setItem("chat_conversations", JSON.stringify(updated));

      return {
        ...state,
        conversations: updated,
      };
    }

    case "UPDATE_CONVERSATION_LAST_MESSAGE": {
      const { message, authUserId } = action.payload;

      const otherUserId =
        Number(message.sender_id) === Number(authUserId)
          ? message.receiver_id
          : message.sender_id;

      const oldConversations = state.conversations || [];

      const updated = oldConversations.map((item) => {
        if (Number(item.user?.id) === Number(otherUserId)) {
          return {
            ...item,
            last_message: message,
          };
        }

        return item;
      });

      localStorage.setItem("chat_conversations", JSON.stringify(updated));

      return {
        ...state,
        conversations: updated,
      };
    }

    /*
    ==========================
    SELECTED USER
    ==========================
    */

    case "SET_SELECTED_USER": {
      localStorage.setItem(
        "chat_selected_user",
        JSON.stringify(action.payload),
      );

      return {
        ...state,
        selectedUser: action.payload,
      };
    }

    /*
    ==========================
    MESSAGES
    ==========================
    */

    case "SET_MESSAGES": {
      const { userId, messages } = action.payload;

      localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(messages));

      return {
        ...state,
        messages: {
          ...state.messages,
          [userId]: messages,
        },
      };
    }

    case "ADD_MESSAGE": {
      const { userId, message } = action.payload;

      const oldMessages = state.messages[userId] || [];

      const exists = oldMessages.some(
        (item) => Number(item.id) === Number(message.id),
      );

      if (exists) {
        return state;
      }

      const updated = [...oldMessages, message];

      localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updated));

      return {
        ...state,
        messages: {
          ...state.messages,
          [userId]: updated,
        },
      };
    }

    case "UPDATE_MESSAGE": {
      const { userId, message } = action.payload;

      const oldMessages = state.messages[userId] || [];

      const updated = oldMessages.map((item) =>
        Number(item.id) === Number(message.id) ? message : item,
      );

      localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updated));

      return {
        ...state,
        messages: {
          ...state.messages,
          [userId]: updated,
        },
      };
    }

    case "DELETE_MESSAGE": {
      const { userId, messageId } = action.payload;

      const oldMessages = state.messages[userId] || [];

      const updated = oldMessages.filter(
        (item) => Number(item.id) !== Number(messageId),
      );

      localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updated));

      return {
        ...state,
        messages: {
          ...state.messages,
          [userId]: updated,
        },
      };
    }

    case "DELETE_FOR_EVERYONE": {
      const { userId, messageId } = action.payload;

      const oldMessages = state.messages[userId] || [];

      const updated = oldMessages.map((item) =>
        Number(item.id) === Number(messageId)
          ? {
              ...item,
              message: null,
              file: null,
              deleted_for_everyone: true,
            }
          : item,
      );

      localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updated));

      return {
        ...state,
        messages: {
          ...state.messages,
          [userId]: updated,
        },
      };
    }

    case "MARK_MESSAGE_SEEN": {
      const { userId, messageId, seenAt } = action.payload;

      const oldMessages = state.messages[userId] || [];

      const updated = oldMessages.map((item) =>
        Number(item.id) === Number(messageId)
          ? {
              ...item,
              is_seen: true,
              seen_at: seenAt,
            }
          : item,
      );

      localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updated));

      return {
        ...state,
        messages: {
          ...state.messages,
          [userId]: updated,
        },
      };
    }

    case "MARK_MESSAGE_DELIVERED": {
      const { userId, messageId, deliveredAt } = action.payload;

      const oldMessages = state.messages[userId] || [];

      const updated = oldMessages.map((item) =>
        Number(item.id) === Number(messageId)
          ? {
              ...item,
              is_delivered: true,
              delivered_at: deliveredAt,
            }
          : item,
      );

      localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updated));

      return {
        ...state,
        messages: {
          ...state.messages,
          [userId]: updated,
        },
      };
    }

    /*
    ==========================
    REACTIONS
    ==========================
    */

    case "ADD_REACTION": {
      const { userId, reaction } = action.payload;

      const oldMessages = state.messages[userId] || [];

      const updated = oldMessages.map((message) => {
        if (Number(message.id) !== Number(reaction.message_id)) {
          return message;
        }

        const oldReactions = message.reactions || [];

        const reactionExists = oldReactions.some(
          (item) => Number(item.user_id) === Number(reaction.user_id),
        );

        const newReactions = reactionExists
          ? oldReactions.map((item) =>
              Number(item.user_id) === Number(reaction.user_id)
                ? reaction
                : item,
            )
          : [...oldReactions, reaction];

        return {
          ...message,
          reactions: newReactions,
        };
      });

      localStorage.setItem(`chat_messages_${userId}`, JSON.stringify(updated));

      return {
        ...state,
        messages: {
          ...state.messages,
          [userId]: updated,
        },
      };
    }

    /*
    ==========================
    TYPING
    ==========================
    */

    case "SET_TYPING": {
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.userId]: action.payload.isTyping,
        },
      };
    }

    /*
    ==========================
    SEARCH
    ==========================
    */

    case "SET_SEARCH_RESULTS": {
      return {
        ...state,
        searchResults: action.payload,
      };
    }

    /*
    ==========================
    LOADING / SENDING / ERROR
    ==========================
    */

    case "SET_LOADING": {
      return {
        ...state,
        loading: action.payload,
      };
    }

    case "SET_SENDING": {
      return {
        ...state,
        sending: action.payload,
      };
    }

    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
      };
    }

    case "CLEAR_CHAT": {
      return {
        ...state,
        selectedUser: null,
        messages: {},
        searchResults: [],
        typingUsers: {},
      };
    }

    

    default:
      return state;
  }
}
