import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageSquare, Send, Users, Settings } from "lucide-react";

export const Route = createFileRoute("/video-call/$appointmentId")({
  head: () => ({ meta: [{ title: "Video Consultation — ClinIQ" }] }),
  component: VideoCallPage,
});

type ChatMsg = { from: "me" | "them"; text: string; t: string };

function VideoCallPage() {
  const { appointmentId } = Route.useParams();
  const navigate = useNavigate();
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [share, setShare] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { from: "them", text: "Hello, I can see you clearly. How are you feeling today?", t: "now" },
  ]);
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [msgs, chatOpen]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const send = () => {
    if (!input.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: input, t: "now" }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { from: "them", text: "Got it, thank you for sharing.", t: "now" }]), 1200);
  };

  const endCall = () => navigate({ to: "/patient/appointments" });

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black">⚕</span>
          <div>
            <p className="text-sm font-bold">Dr. Sarah Hassan</p>
            <p className="text-xs text-white/60">Cardiology · Call #{appointmentId.slice(0, 6)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Live · {fmt(seconds)}
          </span>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <main className="relative flex-1 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4">
          {/* Remote */}
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-zinc-900 to-violet-900">
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-40 w-40 items-center justify-center rounded-full bg-white/10 text-6xl font-black backdrop-blur"
              >
                SH
              </motion.div>
            </div>
            {share && (
              <div className="absolute inset-4 flex items-center justify-center rounded-xl border border-white/20 bg-black/40 backdrop-blur">
                <p className="text-sm text-white/70">Screen sharing active</p>
              </div>
            )}
            <span className="absolute bottom-4 left-4 rounded-md bg-black/50 px-2 py-1 text-xs font-bold backdrop-blur">Dr. Sarah Hassan</span>
          </div>

          {/* Self pip */}
          <motion.div
            drag
            dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
            className="absolute bottom-8 right-8 h-40 w-32 cursor-grab overflow-hidden rounded-xl border-2 border-white/20 bg-gradient-to-br from-sky-700 to-cyan-900 shadow-2xl active:cursor-grabbing sm:h-48 sm:w-36"
          >
            <div className="flex h-full items-center justify-center">
              {cam ? (
                <span className="text-3xl font-black text-white/80">You</span>
              ) : (
                <VideoOff className="h-8 w-8 text-white/60" />
              )}
            </div>
            <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold">You</span>
          </motion.div>
        </main>

        {/* Chat panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.aside
              initial={{ x: 360 }}
              animate={{ x: 0 }}
              exit={{ x: 360 }}
              transition={{ type: "spring", damping: 30 }}
              className="flex w-80 flex-col border-l border-white/10 bg-zinc-900"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h3 className="font-bold">Chat</h3>
                <button onClick={() => setChatOpen(false)} className="rounded-md p-1 hover:bg-white/10">×</button>
              </div>
              <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto p-4">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "me" ? "bg-primary text-primary-foreground" : "bg-white/10"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex gap-2 border-t border-white/10 p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-md bg-white/10 px-3 py-2 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button type="submit" className="rounded-md bg-primary px-3 text-primary-foreground"><Send className="h-4 w-4" /></button>
              </form>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <footer className="flex items-center justify-center gap-3 border-t border-white/10 bg-zinc-900 px-4 py-4">
        <CtlButton active={mic} onClick={() => setMic(!mic)} on={<Mic />} off={<MicOff />} />
        <CtlButton active={cam} onClick={() => setCam(!cam)} on={<Video />} off={<VideoOff />} />
        <CtlButton active={share} onClick={() => setShare(!share)} on={<Monitor />} off={<Monitor />} />
        <CtlButton active={chatOpen} onClick={() => setChatOpen(!chatOpen)} on={<MessageSquare />} off={<MessageSquare />} />
        <button className="rounded-full bg-white/10 p-3 hover:bg-white/20"><Users className="h-5 w-5" /></button>
        <button className="rounded-full bg-white/10 p-3 hover:bg-white/20"><Settings className="h-5 w-5" /></button>
        <button
          onClick={endCall}
          className="ml-2 flex items-center gap-2 rounded-full bg-destructive px-6 py-3 font-bold text-white shadow-lg shadow-destructive/30 hover:bg-destructive/90"
        >
          <PhoneOff className="h-5 w-5" /> End
        </button>
      </footer>
    </div>
  );
}

function CtlButton({ active, onClick, on, off }: { active: boolean; onClick: () => void; on: React.ReactNode; off: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full p-3 transition-colors ${active ? "bg-white/10 hover:bg-white/20" : "bg-destructive/80 hover:bg-destructive"}`}
    >
      <div className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{active ? on : off}</div>
    </button>
  );
}
