import { useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { chatChannels, hrDepartments, projects } from "../../data/mockData";
import HRContactDropdown from "./HRContactDropdown";
import ChatPanel from "../shared/ChatPanel";

export default function EmployeeSidebar() {
  const [selectedChannel, setSelectedChannel] = useState(chatChannels[0]?.id ?? "");
  const currentChannel = chatChannels.find((channel) => channel.id === selectedChannel) ?? chatChannels[0];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">HR Contacts</h3>
        </div>
        <HRContactDropdown departments={hrDepartments} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Project Chats</h3>
          <MessageSquare className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-2">
          {chatChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all ${selectedChannel === channel.id ? "border-primary/40 bg-primary/10 text-foreground" : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground"}`}
            >
              <span>#{channel.name}</span>
              {channel.unread > 0 ? <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">{channel.unread}</span> : null}
            </button>
          ))}
        </div>
        <div className="mt-3">
          {currentChannel ? <ChatPanel channels={chatChannels} /> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Ongoing Projects</h3>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{project.name}</span>
                <span className="text-muted-foreground">{project.progress}%</span>
              </div>
              <div className="mb-2 h-2 rounded-full bg-white/[0.06]">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
              </div>
              <div className="text-[11px] text-muted-foreground">{project.pendingTasks} pending tasks</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
