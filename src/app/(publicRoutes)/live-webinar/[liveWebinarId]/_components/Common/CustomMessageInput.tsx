import React from "react";
import { useMessageInputContext } from "stream-chat-react";
import { Send, Plus } from "lucide-react";

export const CustomMessageInput = () => {
  const { handleSubmit, text, handleChange } = useMessageInputContext();

  return (
    <div className="flex items-center gap-2 p-2 w-full max-w-full box-border bg-card border-t border-border/10">
      <button className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0">
        <Plus size={18} />
      </button>
      <div className="flex-1 flex items-center bg-muted rounded-full px-3 h-9 focus-within:ring-1 focus-within:ring-primary/50 min-w-0">
        <input
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.BaseSyntheticEvent);
            }
          }}
          placeholder="Type your message"
          className="flex-1 w-full min-w-0 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground text-foreground"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 shrink-0"
      >
        <Send size={18} />
      </button>
    </div>
  );
};
