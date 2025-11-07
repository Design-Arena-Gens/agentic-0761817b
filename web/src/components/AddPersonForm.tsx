import { useState } from "react";
import { PersonProfile } from "@/lib/types";

type AddPersonFormProps = {
  onCreate(person: PersonProfile): void;
};

export function AddPersonForm({ onCreate }: AddPersonFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    const person: PersonProfile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim() || undefined,
      cards: [],
    };
    onCreate(person);
    setName("");
    setEmail("");
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl bg-sky-500/10 px-4 py-3 text-left text-sm font-medium text-sky-600 transition hover:bg-sky-500/20 dark:bg-sky-500/20 dark:text-sky-300 dark:hover:bg-sky-500/30"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>Add person</span>
        <span>{isOpen ? "–" : "+"}</span>
      </button>
      {isOpen && (
        <form className="mt-4 space-y-3 text-sm" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-500">
              Name
            </label>
            <input
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-inner shadow-zinc-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-zinc-800/70 dark:focus:border-sky-400 dark:focus:ring-sky-600/40"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Priya Patel"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-500">
              Email (optional)
            </label>
            <input
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-inner shadow-zinc-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-zinc-800/70 dark:focus:border-sky-400 dark:focus:ring-sky-600/40"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-transparent px-3 py-2 text-xs font-medium text-zinc-500 transition hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              onClick={() => {
                setIsOpen(false);
                setName("");
                setEmail("");
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-500"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
