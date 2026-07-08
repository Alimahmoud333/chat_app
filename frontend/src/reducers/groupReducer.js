export default function groupReducer(state, action) {
  switch (action.type) {
    /*
    ==========================
    GROUPS
    ==========================
    */

    case "SET_GROUPS": {
      localStorage.setItem("chat_groups", JSON.stringify(action.payload));

      return {
        ...state,
        groups: action.payload,
      };
    }

    case "ADD_GROUP": {
      const oldGroups = state.groups || [];

      const exists = oldGroups.some(
        (group) => Number(group.id) === Number(action.payload.id),
      );

      if (exists) {
        return state;
      }

      const updated = [action.payload, ...oldGroups];

      localStorage.setItem("chat_groups", JSON.stringify(updated));

      return {
        ...state,
        groups: updated,
      };
    }

    case "UPDATE_GROUP": {
      const updated = state.groups.map((group) =>
        Number(group.id) === Number(action.payload.id) ? action.payload : group,
      );

      localStorage.setItem("chat_groups", JSON.stringify(updated));

      return {
        ...state,
        groups: updated,
      };
    }

    case "DELETE_GROUP": {
      const updated = state.groups.filter(
        (group) => Number(group.id) !== Number(action.payload),
      );

      localStorage.setItem("chat_groups", JSON.stringify(updated));

      localStorage.removeItem(`chat_group_messages_${action.payload}`);

      return {
        ...state,
        groups: updated,
        selectedGroup:
          Number(state.selectedGroup?.id) === Number(action.payload)
            ? null
            : state.selectedGroup,
      };
    }

    /*
    ==========================
    SELECTED GROUP
    ==========================
    */

    case "SET_SELECTED_GROUP": {
      localStorage.setItem(
        "chat_selected_group",
        JSON.stringify(action.payload),
      );

      return {
        ...state,
        selectedGroup: action.payload,
      };
    }

    /*
    ==========================
    GROUP MESSAGES
    ==========================
    */

    case "SET_GROUP_MESSAGES": {
      const { groupId, messages } = action.payload;

      localStorage.setItem(
        `chat_group_messages_${groupId}`,
        JSON.stringify(messages),
      );

      return {
        ...state,
        messages: {
          ...state.messages,
          [groupId]: messages,
        },
      };
    }

    case "ADD_GROUP_MESSAGE": {
      const { groupId, message } = action.payload;

      const oldMessages = state.messages[groupId] || [];

      const exists = oldMessages.some(
        (item) => Number(item.id) === Number(message.id),
      );

      if (exists) {
        return state;
      }

      const updated = [...oldMessages, message];

      localStorage.setItem(
        `chat_group_messages_${groupId}`,
        JSON.stringify(updated),
      );

      return {
        ...state,
        messages: {
          ...state.messages,
          [groupId]: updated,
        },
      };
    }

    /*
    ==========================
    MEMBERS
    ==========================
    */

    case "ADD_GROUP_MEMBER": {
      const { groupId, member } = action.payload;

      if (Number(state.selectedGroup?.id) !== Number(groupId)) {
        return state;
      }

      const oldMembers = state.selectedGroup?.members || [];

      const exists = oldMembers.some(
        (item) => Number(item.id) === Number(member.id),
      );

      if (exists) {
        return state;
      }

      const updatedGroup = {
        ...state.selectedGroup,
        members: [...oldMembers, member],
      };

      localStorage.setItem("chat_selected_group", JSON.stringify(updatedGroup));

      return {
        ...state,
        selectedGroup: updatedGroup,
      };
    }

    case "REMOVE_GROUP_MEMBER": {
      const { groupId, userId } = action.payload;

      if (Number(state.selectedGroup?.id) !== Number(groupId)) {
        return state;
      }

      const updatedGroup = {
        ...state.selectedGroup,
        members: (state.selectedGroup?.members || []).filter(
          (member) => Number(member.id) !== Number(userId),
        ),
      };

      localStorage.setItem("chat_selected_group", JSON.stringify(updatedGroup));

      return {
        ...state,
        selectedGroup: updatedGroup,
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

    case "CLEAR_GROUP_CACHE": {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("chat_group_")) {
          localStorage.removeItem(key);
        }
      });

      return {
        ...state,
        groups: [],
        selectedGroup: null,
        messages: {},
      };
    }

    default:
      return state;
  }
}
