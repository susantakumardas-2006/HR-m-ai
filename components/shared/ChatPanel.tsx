import { useState } from "react";
import type { ChatChannel, ChatMessage } from "../../data/mockData";

interface ChatPanelProps {
  channels: ChatChannel[];
}

export default function ChatPanel({ channels }: ChatPanelProps) {
  const [activeChannel, setActiveChannel] = useState<string>(channels[0]?.id ?? "");
  const [inputVal, setInputVal] = useState("");

  const channel = channels.find((c) => c.id === activeChannel);

  function renderMessages(messages: ChatMessage[]) {
    return messages.map((msg, i) => {
      const prevMsg = i > 0 ? messages[i - 1] : null;
      const sameUser = prevMsg?.userId === msg.userId;

      return (
        <div
          key={msg.id}
          className={`flex gap-3 px-4 py-1 hover:bg-white/[0.02] ${!sameUser ? "mt-3" : "mt-0.5"}`}
        >
          {/* Avatar or spacer */}
          {!sameUser ? (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ backgroundColor: msg.userColor + "22", color: msg.userColor }}
            >
              {msg.userName.split(" ").map((n) => n[0]).join("")}
            </div>
          ) : (
            <div className="w-8 flex-shrink-0" />
          )}

          <div className="min-w-0 flex-1">
            {!sameUser && (
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-sm font-semibold" style={{ color: msg.userColor }}>
                  {msg.userName}
                </span>
                <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
              </div>
            )}
            <p className="text-sm text-foreground/90 leading-relaxed">{msg.content}</p>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden flex flex-col" style={{ height: 420 }}>
      {/* Channel tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border overflow-x-auto bg-card/50">
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              ch.id === activeChannel
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
            }`}
          >
            <span className="text-muted-foreground">#</span>
            {ch.name}
            {ch.unread > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                {ch.unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Channel header */}
      {channel && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">#</span>
            <span className="text-sm font-semibold text-foreground">{channel.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">{channel.members} members</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-2">
        {channel ? renderMessages(channel.messages) : (
          <p className="text-sm text-muted-foreground p-4">Select a channel</p>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-chat-bg p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Message #${channel?.name ?? "channel"}...`}
            className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={() => setInputVal("")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all h-9 w-9 rounded-lg flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
