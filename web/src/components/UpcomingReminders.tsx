import { formatDueDate } from "@/lib/reminder-utils";
import { UpcomingReminder } from "@/lib/types";

type UpcomingRemindersProps = {
  reminders: UpcomingReminder[];
};

export function UpcomingReminders({ reminders }: UpcomingRemindersProps) {
  if (reminders.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60">
        No reminders due in the next two weeks. Add cards or adjust due dates to
        get started.
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {reminders.map((reminder) => (
        <article
          key={reminder.cardId}
          className={`flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm shadow-zinc-200/40 ring-1 ring-transparent transition hover:ring-sky-200/70 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950 dark:hover:ring-sky-400/50 ${
            reminder.status === "overdue"
              ? "border-rose-500/40 bg-rose-100/60 dark:border-rose-500/40 dark:bg-rose-950/40"
              : reminder.status === "dueToday"
                ? "border-amber-500/40 bg-amber-100/60 dark:border-amber-500/40 dark:bg-amber-950/40"
                : ""
          }`}
        >
          <div className="flex flex-1 flex-col md:flex-row md:items-center md:gap-4">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {reminder.cardNickname}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {reminder.personName}
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {formatDueDate(reminder.dueDate)}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {reminder.autopay ? "Autopay" : "Manual"} • Due in{" "}
              {reminder.daysUntilDue >= 0
                ? `${reminder.daysUntilDue} days`
                : `${Math.abs(reminder.daysUntilDue)} days ago`}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
