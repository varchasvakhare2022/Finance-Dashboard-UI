import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createId } from "../../utils/finance";

function buildInitialState(transaction, categories) {
  return {
    id: transaction?.id ?? createId(),
    date: transaction?.date ?? new Date().toISOString().slice(0, 10),
    description: transaction?.description ?? "",
    category: transaction?.category ?? categories[0] ?? "Food",
    amount: transaction?.amount ? String(transaction.amount) : "",
    type: transaction?.type ?? "expense",
  };
}

export function TransactionFormModal({ open, transaction, categories, onClose, onSubmit }) {
  const [form, setForm] = useState(buildInitialState(transaction, categories));

  useEffect(() => {
    if (open) {
      setForm(buildInitialState(transaction, categories));
    }
  }, [categories, open, transaction]);

  if (!open) {
    return null;
  }

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.description.trim() || !form.amount) {
      return;
    }

    onSubmit({
      ...form,
      description: form.description.trim(),
      amount: Number(form.amount),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-line/50 bg-surface p-6 shadow-panel">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">
              {transaction ? "Editing a transaction" : "Add a transaction"}
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
              {transaction ? "Update the details" : "Add something new to the ledger"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pressable rounded-2xl bg-surface-strong/60 p-3 text-muted transition hover:bg-surface hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-ink">Description</span>
            <input
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              placeholder="Rent, salary, groceries, train tickets..."
              className="w-full rounded-[18px] border border-line/45 bg-surface-strong/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/30"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => handleChange("date", event.target.value)}
              className="w-full rounded-[18px] border border-line/45 bg-surface-strong/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/30"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Amount</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.amount}
              onChange={(event) => handleChange("amount", event.target.value)}
              placeholder="0"
              className="w-full rounded-[18px] border border-line/45 bg-surface-strong/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/30"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Category</span>
            <select
              value={form.category}
              onChange={(event) => handleChange("category", event.target.value)}
              className="w-full rounded-[18px] border border-line/45 bg-surface-strong/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/30"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink">Type</span>
            <select
              value={form.type}
              onChange={(event) => handleChange("type", event.target.value)}
              className="w-full rounded-[18px] border border-line/45 bg-surface-strong/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/30"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <div className="mt-2 flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="pressable rounded-[18px] bg-surface-strong/55 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
            >
              Never mind
            </button>
            <button
              type="submit"
              className="pressable rounded-[18px] bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              {transaction ? "Save changes" : "Save transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
