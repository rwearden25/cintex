import ChatClient from "./ui";

export default function ChatPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-extrabold">Diagnostics Chat</h1>
      <p className="text-sm text-slate-300">
        Ask a question, then save the result into a report (next step).
      </p>
      <ChatClient />
    </div>
  );
}
