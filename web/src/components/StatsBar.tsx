import { totalAmountDue, getReminderStatus } from "@/lib/reminder-utils";
import { PersonProfile } from "@/lib/types";

type StatsBarProps = {
  people: PersonProfile[];
};

export function StatsBar({ people }: StatsBarProps) {
  const totalCards = people.reduce((acc, person) => acc + person.cards.length, 0);
  const totalAutopay = people.reduce(
    (acc, person) => acc + person.cards.filter((card) => card.autopay).length,
    0,
  );

  const overdueCount = people.reduce(
    (acc, person) =>
      acc +
      person.cards.filter((card) => getReminderStatus(card.dueDate) === "overdue")
        .length,
    0,
  );

  const amountDue = totalAmountDue(people);

  return (
    <section className="grid gap-3 md:grid-cols-4">
      <StatCard label="People" value={people.length} accent="bg-sky-500/10" />
      <StatCard label="Cards" value={totalCards} accent="bg-purple-500/10" />
      <StatCard
        label="Auto-pay"
        value={`${totalAutopay}/${totalCards}`}
        accent="bg-emerald-500/10"
      />
      <StatCard
        label="Due / Overdue"
        value={`$${amountDue.toFixed(2)} (${overdueCount})`}
        accent="bg-rose-500/10"
      />
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  accent: string;
};

function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950">
      <div className={`h-2 w-12 rounded-full ${accent}`} />
      <p className="mt-3 text-sm font-medium text-zinc-500">{label}</p>
      <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}
