import { useState } from "react";
import { formatDueDate, getReminderStatus } from "@/lib/reminder-utils";
import { CreditCardAccount, PersonProfile } from "@/lib/types";

type PersonCardProps = {
  person: PersonProfile;
  onAddCard(personId: string, card: CreditCardAccount): void;
  onDeleteCard(personId: string, cardId: string): void;
  onUpdateCard(
    personId: string,
    cardId: string,
    patch: Partial<CreditCardAccount>,
  ): void;
  onDeletePerson(personId: string): void;
  onMarkPaid(personId: string, cardId: string): void;
};

export function PersonCard({
  person,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
  onDeletePerson,
  onMarkPaid,
}: PersonCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {person.name}
          </h2>
          {person.email && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {person.email}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDeletePerson(person.id)}
          className="rounded-lg border border-transparent px-3 py-1 text-xs font-medium text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-rose-400/20 dark:hover:text-rose-300"
        >
          Remove person
        </button>
      </header>

      <div className="space-y-3">
        {person.cards.map((card) => (
          <CreditCardRow
            key={card.id}
            card={card}
            onDelete={() => onDeleteCard(person.id, card.id)}
            onUpdate={(patch) => onUpdateCard(person.id, card.id, patch)}
            onMarkPaid={() => onMarkPaid(person.id, card.id)}
          />
        ))}
        {person.cards.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No credit cards yet. Add one below to start tracking reminders.
          </p>
        )}
      </div>

      <div className="border-t border-dashed border-zinc-200 pt-4 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setIsFormOpen((value) => !value)}
          className="flex w-full items-center justify-between rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <span>Add credit card</span>
          <span>{isFormOpen ? "–" : "+"}</span>
        </button>
        {isFormOpen && (
          <AddCardForm
            onSubmit={(card) => {
              onAddCard(person.id, card);
              setIsFormOpen(false);
            }}
          />
        )}
      </div>
    </section>
  );
}

type CreditCardRowProps = {
  card: CreditCardAccount;
  onDelete(): void;
  onUpdate(patch: Partial<CreditCardAccount>): void;
  onMarkPaid(): void;
};

function CreditCardRow({
  card,
  onDelete,
  onUpdate,
  onMarkPaid,
}: CreditCardRowProps) {
  const status = getReminderStatus(card.dueDate);
  const statusLabel =
    status === "overdue"
      ? "Overdue"
      : status === "dueToday"
        ? "Due today"
        : status === "dueSoon"
          ? "Due soon"
          : "Scheduled";

  return (
    <article className="flex flex-wrap items-start gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-inner shadow-zinc-200/70 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-zinc-900/60">
      <div
        className="h-16 w-20 flex-none rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 p-3 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950 dark:text-zinc-300"
        style={{ backgroundColor: card.color }}
      >
        {card.issuer}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {card.nickname}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              status === "overdue"
                ? "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300"
                : status === "dueToday"
                  ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300"
                  : status === "dueSoon"
                    ? "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300"
                    : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300"
            }`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {formatDueDate(card.dueDate)} • ${card.amountDue.toFixed(2)}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={card.autopay}
              onChange={(event) => onUpdate({ autopay: event.target.checked })}
            />
            Autopay
          </label>
          <span>Remind {card.remindDaysBefore}d before</span>
          <button
            type="button"
            className="rounded border border-transparent px-2 py-1 text-xs font-medium text-sky-600 transition hover:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
            onClick={() =>
              onUpdate({ remindDaysBefore: Math.max(1, card.remindDaysBefore + 1) })
            }
          >
            +1 day
          </button>
          {card.remindDaysBefore > 1 && (
            <button
              type="button"
              className="rounded border border-transparent px-2 py-1 text-xs font-medium text-sky-600 transition hover:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
              onClick={() =>
                onUpdate({ remindDaysBefore: card.remindDaysBefore - 1 })
              }
            >
              -1 day
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 text-xs">
        <button
          type="button"
          className="w-full rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          onClick={onMarkPaid}
        >
          Mark paid
        </button>
        <button
          type="button"
          className="text-zinc-400 transition hover:text-rose-500"
          onClick={onDelete}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

type AddCardFormProps = {
  onSubmit(card: CreditCardAccount): void;
};

function AddCardForm({ onSubmit }: AddCardFormProps) {
  const [nickname, setNickname] = useState("");
  const [issuer, setIssuer] = useState("");
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amountDue, setAmountDue] = useState("0");
  const [autopay, setAutopay] = useState(false);
  const [remindDaysBefore, setRemindDaysBefore] = useState(5);
  const [paymentFrequency, setPaymentFrequency] =
    useState<CreditCardAccount["paymentFrequency"]>("monthly");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nickname.trim() || !issuer.trim()) return;

    const card: CreditCardAccount = {
      id: crypto.randomUUID(),
      nickname: nickname.trim(),
      issuer: issuer.trim(),
      dueDate,
      amountDue: Number.parseFloat(amountDue) || 0,
      autopay,
      remindDaysBefore,
      paymentFrequency,
      color: undefined,
    };

    onSubmit(card);
    setNickname("");
    setIssuer("");
    setAmountDue("0");
    setAutopay(false);
    setRemindDaysBefore(5);
    setPaymentFrequency("monthly");
  }

  return (
    <form className="mt-4 grid gap-3 text-sm md:grid-cols-2" onSubmit={handleSubmit}>
      <Input
        label="Card nickname"
        value={nickname}
        onChange={setNickname}
        placeholder="e.g. Sapphire"
        required
      />
      <Input
        label="Issuer"
        value={issuer}
        onChange={setIssuer}
        placeholder="e.g. Chase"
        required
      />
      <Input
        label="Due date"
        value={dueDate}
        onChange={setDueDate}
        type="date"
        required
      />
      <Input
        label="Amount due"
        value={amountDue}
        onChange={setAmountDue}
        type="number"
        min="0"
        step="0.01"
        required
      />
      <div className="col-span-full flex items-center gap-3 rounded-xl bg-zinc-100 px-4 py-2 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autopay}
            onChange={(event) => setAutopay(event.target.checked)}
          />
          Autopay enabled
        </label>
        <label className="flex items-center gap-2">
          Remind
          <input
            type="number"
            min={1}
            max={15}
            className="w-16 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
            value={remindDaysBefore}
            onChange={(event) => setRemindDaysBefore(Number(event.target.value))}
          />
          days before
        </label>
        <label className="flex items-center gap-2">
          Frequency
          <select
            value={paymentFrequency}
            onChange={(event) =>
              setPaymentFrequency(event.target.value as CreditCardAccount["paymentFrequency"])
            }
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
          >
            <option value="monthly">Monthly</option>
            <option value="biweekly">Every 2 weeks</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </div>
      <div className="col-span-full flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
        >
          Add card
        </button>
      </div>
    </form>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange(value: string): void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  min?: string;
  max?: string;
  step?: string;
};

function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  min,
  max,
  step,
}: InputProps) {
  return (
    <label className="space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
      <span className="block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <input
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-inner shadow-zinc-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-zinc-800/60 dark:focus:border-sky-400 dark:focus:ring-sky-500/40"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        min={min}
        max={max}
        step={step}
      />
    </label>
  );
}
