"use client";

import { useEffect, useMemo, useState } from "react";
import { AddPersonForm } from "@/components/AddPersonForm";
import { PersonCard } from "@/components/PersonCard";
import { StatsBar } from "@/components/StatsBar";
import { UpcomingReminders } from "@/components/UpcomingReminders";
import { loadProfiles, saveProfiles, clearProfiles } from "@/lib/storage";
import {
  buildUpcomingReminders,
  generateColorFromName,
  rollDueDateForward,
} from "@/lib/reminder-utils";
import { createSampleProfiles } from "@/lib/sample-data";
import { CreditCardAccount, PersonProfile } from "@/lib/types";

export default function Home() {
  const [people, setPeople] = useState<PersonProfile[]>(() => {
    const stored = loadProfiles();
    if (stored && stored.length > 0) {
      return stored;
    }
    return createSampleProfiles();
  });

  useEffect(() => {
    saveProfiles(people);
  }, [people]);

  const reminders = useMemo(
    () => buildUpcomingReminders(people),
    [people],
  );

  function updatePerson(
    personId: string,
    update: (person: PersonProfile) => PersonProfile,
  ) {
    setPeople((prev) =>
      prev.map((person) => (person.id === personId ? update(person) : person)),
    );
  }

  function handleAddPerson(person: PersonProfile) {
    setPeople((prev) => [...prev, person]);
  }

  function handleDeletePerson(personId: string) {
    setPeople((prev) => prev.filter((person) => person.id !== personId));
  }

  function handleAddCard(personId: string, card: CreditCardAccount) {
    const enrichedCard: CreditCardAccount = {
      ...card,
      color: card.color ?? generateColorFromName(card.nickname),
    };
    updatePerson(personId, (person) => ({
      ...person,
      cards: [...person.cards, enrichedCard],
    }));
  }

  function handleDeleteCard(personId: string, cardId: string) {
    updatePerson(personId, (person) => ({
      ...person,
      cards: person.cards.filter((card) => card.id !== cardId),
    }));
  }

  function handleUpdateCard(
    personId: string,
    cardId: string,
    patch: Partial<CreditCardAccount>,
  ) {
    updatePerson(personId, (person) => ({
      ...person,
      cards: person.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              ...patch,
            }
          : card,
      ),
    }));
  }

  function handleMarkPaid(personId: string, cardId: string) {
    updatePerson(personId, (person) => ({
      ...person,
      cards: person.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              lastPaidOn: new Date().toISOString().slice(0, 10),
              dueDate: rollDueDateForward(card.dueDate, card.paymentFrequency),
            }
          : card,
      ),
    }));
  }

  function handleReset() {
    clearProfiles();
    setPeople(createSampleProfiles());
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 px-4 py-8 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-sky-950 dark:text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Household Credit Card Reminders
            </h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Coordinate credit card bill payments across roommates, partners, or teams.
              Add each person&apos;s cards, track due dates, and stay ahead of upcoming bills.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-transparent bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:border-sky-200 hover:text-sky-600 dark:bg-zinc-900 dark:hover:border-sky-500/40 dark:hover:text-sky-300"
          >
            Restore sample data
          </button>
        </header>

        <StatsBar people={people} />

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            {people.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                onUpdateCard={handleUpdateCard}
                onDeletePerson={handleDeletePerson}
                onMarkPaid={handleMarkPaid}
              />
            ))}
            <AddPersonForm onCreate={handleAddPerson} />
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Upcoming reminders
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                We surface bills due in the next two weeks so the team can plan ahead.
              </p>
              <div className="mt-4">
                <UpcomingReminders reminders={reminders} />
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-500 shadow-sm shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:shadow-zinc-950">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Workflow suggestions
              </h3>
              <ul className="mt-2 space-y-2">
                <li>Share the dashboard during monthly budget syncs.</li>
                <li>Note which cards have autopay so nothing slips.</li>
                <li>Log manual payments to roll the due date ahead.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
