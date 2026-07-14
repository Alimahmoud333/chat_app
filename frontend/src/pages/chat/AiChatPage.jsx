import { useEffect, useRef, useState } from "react";

import API from "../../api/axios";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import { DEFAULT_AVATAR } from "../../constants";

export default function AiChatPage() {
  const { user } = useAuth();

  const { showToast } = useToast();

  const bottomRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = JSON.parse(
        localStorage.getItem("chat_ai_messages"),
      );

      if (!Array.isArray(savedMessages)) {
        return [];
      }

      /*
      Clean old wrong messages if any message was saved as object
      */

      return savedMessages.map((item) => ({
        ...item,
        message:
          typeof item.message === "string"
            ? item.message
            : item.message?.message || "Invalid saved message",
      }));
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("chat_ai_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length, loading]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    const userText = message.trim();

    const userMessage = {
      id: Date.now(),
      role: "user",
      message: userText,
      created_at: new Date().toISOString(),
    };

    setMessages((oldMessages) => [...oldMessages, userMessage]);

    setMessage("");

    setLoading(true);

    try {
      const res = await API.post("/ai-chat", {
        message: userText,
      });

      const aiText =
        res.data.reply ||
        res.data.ai_message?.message ||
        res.data.message ||
        "No response from AI";

      const aiMessage = {
        id: res.data.ai_message?.id || Date.now() + 1,
        role: "assistant",
        message: aiText,
        created_at: res.data.ai_message?.created_at || new Date().toISOString(),
      };

      setMessages((oldMessages) => [...oldMessages, aiMessage]);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to get AI response",
        "danger",
      );

      const errorMessage = {
        id: Date.now() + 2,
        role: "assistant",
        message:
          "Sorry, I could not answer right now. Please check your backend AI configuration.",
        created_at: new Date().toISOString(),
        is_error: true,
      };

      setMessages((oldMessages) => [...oldMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    const confirmed = window.confirm("Are you sure you want to clear AI chat?");

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("chat_ai_messages");

    setMessages([]);
  }

  function formatTime(date) {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function renderMessageText(value) {
    if (typeof value === "string") {
      return value;
    }

    if (value?.message) {
      return value.message;
    }

    return "Invalid message";
  }

  return (
    <div className="ai-chat-page">
      <div className="ai-chat-header">
        <div className="d-flex align-items-center gap-3">
          <div className="ai-avatar">
            <i className="bi bi-robot"></i>
          </div>

          <div>
            <h5 className="fw-bold mb-0">AI Assistant</h5>

            <small className="text-muted">
              Ask anything about your project, code, or messages
            </small>
          </div>
        </div>

        <button className="btn btn-light rounded-3" onClick={clearChat}>
          <i className="bi bi-trash me-1"></i>
          Clear
        </button>
      </div>

      <div className="ai-chat-body">
        {messages.length === 0 && (
          <div className="ai-welcome-card">
            <div className="ai-welcome-icon">
              <i className="bi bi-stars"></i>
            </div>

            <h4 className="fw-bold mb-2">How can I help you?</h4>

            <p className="text-muted mb-4">
              You can ask the AI assistant about your chat features, errors, or
              project ideas.
            </p>

            <div className="row g-3">
              <div className="col-md-6">
                <button
                  type="button"
                  className="ai-suggestion-card"
                  onClick={() =>
                    setMessage("Explain my chat application architecture.")
                  }
                >
                  <i className="bi bi-diagram-3"></i>
                  <span>Explain my chat architecture</span>
                </button>
              </div>

              <div className="col-md-6">
                <button
                  type="button"
                  className="ai-suggestion-card"
                  onClick={() =>
                    setMessage("Give me ideas to improve this chat app.")
                  }
                >
                  <i className="bi bi-lightbulb"></i>
                  <span>Give improvement ideas</span>
                </button>
              </div>

              <div className="col-md-6">
                <button
                  type="button"
                  className="ai-suggestion-card"
                  onClick={() =>
                    setMessage(
                      "How can I explain this project in an interview?",
                    )
                  }
                >
                  <i className="bi bi-person-workspace"></i>
                  <span>Interview explanation</span>
                </button>
              </div>

              <div className="col-md-6">
                <button
                  type="button"
                  className="ai-suggestion-card"
                  onClick={() => setMessage("What features should I add next?")}
                >
                  <i className="bi bi-list-check"></i>
                  <span>Next feature ideas</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {messages.map((item) => {
          const isMine = item.role === "user";

          return (
            <div
              key={item.id}
              className={`ai-message-row ${isMine ? "mine" : "assistant"}`}
            >
              {!isMine && (
                <div className="ai-message-avatar">
                  <i className="bi bi-robot"></i>
                </div>
              )}

              <div
                className={`ai-message-bubble ${
                  item.is_error ? "ai-error-bubble" : ""
                }`}
              >
                <div className="ai-message-text">
                  {renderMessageText(item.message)}
                </div>

                <div className="ai-message-time">
                  {formatTime(item.created_at)}
                </div>
              </div>

              {isMine && (
                <img
                  src={`${DEFAULT_AVATAR}&name=${encodeURIComponent(
                    user?.name || "User",
                  )}`}
                  alt={user?.name || "User"}
                  className="ai-user-avatar"
                />
              )}
            </div>
          );
        })}

        {loading && (
          <div className="ai-message-row assistant">
            <div className="ai-message-avatar">
              <i className="bi bi-robot"></i>
            </div>

            <div className="ai-message-bubble">
              <div className="typing-bubble ai-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <form className="ai-chat-input" onSubmit={handleSubmit}>
        <input
          className="form-control"
          placeholder="Ask AI anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <i className="bi bi-send"></i>
          )}
        </button>
      </form>
    </div>
  );
}
