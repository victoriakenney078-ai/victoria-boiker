"use client";

import type { ChatTurn } from "@/lib/galleryConcierge";
import { FormEvent, useEffect, useRef, useState } from "react";

const STORAGE = "victoria-boiker-chat";
const KEEP = 24;

type Thread = {
  messages: ChatTurn[];
  memory: string;
};

const greeting: ChatTurn = {
  role: "assistant",
  content:
    "Good afternoon. Ask about any work, its price, or the cart. This conversation is kept, so a later question can return to what we have already said.",
};

function emptyThread(): Thread {
  return { messages: [greeting], memory: "" };
}

function readThread(): Thread {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE) ?? "") as Partial<Thread>;
    if (!parsed || !Array.isArray(parsed.messages) || parsed.messages.length === 0) return emptyThread();
    const messages = parsed.messages.filter(
      (turn): turn is ChatTurn =>
        Boolean(turn) &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string" &&
        turn.content.trim().length > 0,
    );
    if (messages.length === 0) return emptyThread();
    return { messages, memory: typeof parsed.memory === "string" ? parsed.memory : "" };
  } catch {
    return emptyThread();
  }
}

function pack(thread: Thread): Thread {
  if (thread.messages.length <= KEEP) return thread;
  const older = thread.messages.slice(0, thread.messages.length - KEEP);
  const note = older.map((turn) => `${turn.role}: ${turn.content}`).join("\n");
  return {
    messages: thread.messages.slice(-KEEP),
    memory: `${thread.memory}\n${note}`.trim().slice(-8000),
  };
}

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState<Thread>(emptyThread);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setThread(readThread());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE, JSON.stringify(thread));
  }, [thread, ready]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [open, thread.messages, pending]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || pending) return;
    const next = pack({
      ...thread,
      messages: [...thread.messages, { role: "user", content }],
    });
    setThread(next);
    setDraft("");
    setPending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const payload = (await response.json()) as { reply?: string; error?: string };
      const reply =
        payload.reply?.trim() ||
        payload.error ||
        "The gallery could not answer just now. The conversation is still here.";
      setThread((current) =>
        pack({
          ...current,
          messages: [...current.messages, { role: "assistant", content: reply }],
        }),
      );
    } catch {
      setThread((current) =>
        pack({
          ...current,
          messages: [
            ...current.messages,
            {
              role: "assistant",
              content: "The gallery could not answer just now. The conversation is still here.",
            },
          ],
        }),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex w-[min(100vw-2.5rem,22rem)] flex-col items-end gap-3">
      {open ? (
        <section className="flex h-[min(70vh,34rem)] w-full flex-col border border-hairline bg-navy-elevated">
          <header className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Gallery chat</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
            >
              Close
            </button>
          </header>
          <div ref={listRef} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
            {thread.messages.map((turn, index) => (
              <p
                key={`${turn.role}-${index}`}
                className={`max-w-[90%] font-sans text-sm font-light leading-6 ${
                  turn.role === "user" ? "ml-auto text-parchment" : "text-ink"
                }`}
              >
                {turn.content}
              </p>
            ))}
            {pending ? <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-brass">Writing</p> : null}
          </div>
          <form onSubmit={send} className="border-t border-hairline px-4 py-3">
            <label className="block">
              <span className="sr-only">Message</span>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={2}
                placeholder="Ask about a work"
                className="w-full resize-none border-0 border-b border-hairline bg-transparent py-2 font-sans text-sm font-light text-parchment placeholder:text-ink/50 focus:border-brass"
              />
            </label>
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              className="mt-3 border border-brass px-4 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </section>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="border border-brass bg-navy px-4 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-parchment"
      >
        {open ? "Hide chat" : "Live chat"}
      </button>
    </div>
  );
}
