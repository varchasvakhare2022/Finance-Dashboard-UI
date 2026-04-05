function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function stripTime(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function addDays(date, days) {
  const next = stripTime(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function buildMockTransactions() {
  const today = stripTime(new Date());
  const startDate = addDays(today, -210);
  const transactions = [];
  let sequence = 1;

  const pushTransaction = (date, description, category, amount, type) => {
    transactions.push({
      id: `seed-${sequence}`,
      date: toDateKey(date),
      description,
      category,
      amount,
      type,
    });
    sequence += 1;
  };

  for (let cursor = new Date(startDate); cursor <= today; cursor = addDays(cursor, 1)) {
    const date = stripTime(cursor);
    const day = date.getDay();
    const dateOfMonth = date.getDate();
    const monthIndex = date.getMonth();
    const seasonalLift = 1 + ((monthIndex % 4) * 0.06);

    if (dateOfMonth === 1) {
      pushTransaction(
        date,
        "Salary - Arcadia Capital",
        "Salary",
        128000 + ((monthIndex + 1) % 2) * 4500,
        "income",
      );
    }

    if (dateOfMonth === 15 && monthIndex % 2 === 0) {
      pushTransaction(
        date,
        "Freelance consulting payout",
        "Freelance",
        19000 + monthIndex * 1200,
        "income",
      );
    }

    if (dateOfMonth === 20 && monthIndex % 2 === 1) {
      pushTransaction(
        date,
        "Quarterly performance bonus",
        "Freelance",
        12000 + monthIndex * 900,
        "income",
      );
    }

    if (dateOfMonth === 2) {
      pushTransaction(
        date,
        "Skyline Residency rent",
        "Housing",
        32000 + (monthIndex % 3) * 1200,
        "expense",
      );
    }

    if (dateOfMonth === 4) {
      pushTransaction(
        date,
        "Electricity, internet, and water",
        "Utilities",
        4100 + (monthIndex % 2) * 650,
        "expense",
      );
    }

    if (dateOfMonth === 8) {
      pushTransaction(
        date,
        "Streaming, SaaS, and cloud tools",
        "Subscriptions",
        2399 + (monthIndex % 2) * 360,
        "expense",
      );
    }

    if (dateOfMonth === 24) {
      pushTransaction(
        date,
        "Gym, workspace, and memberships",
        "Subscriptions",
        1599 + (monthIndex % 3) * 220,
        "expense",
      );
    }

    if (day === 1 || day === 3) {
      pushTransaction(
        date,
        day === 1 ? "Metro top-up" : "Office commute and cabs",
        "Transport",
        260 + ((dateOfMonth * 19) % 460),
        "expense",
      );
    }

    if (day === 6) {
      pushTransaction(
        date,
        "Weekly grocery stock-up",
        "Groceries",
        Math.round((1800 + ((dateOfMonth * 73) % 2200)) * seasonalLift),
        "expense",
      );
    }

    if (day === 5) {
      pushTransaction(
        date,
        "Team dinner and coffee",
        "Food",
        Math.round((920 + ((dateOfMonth * 41) % 1500)) * seasonalLift),
        "expense",
      );
    }

    if (day === 0) {
      pushTransaction(
        date,
        "Weekend brunch and cafe hopping",
        "Food",
        Math.round((680 + ((dateOfMonth * 29) % 920)) * (seasonalLift + 0.04)),
        "expense",
      );
    }

    if (day === 6 && dateOfMonth > 9 && dateOfMonth < 29 && dateOfMonth % 2 === 0) {
      pushTransaction(
        date,
        "Cinema tickets and late-night plans",
        "Entertainment",
        700 + ((dateOfMonth * 31) % 1400),
        "expense",
      );
    }

    if (day === 0 && dateOfMonth % 3 === 0) {
      pushTransaction(
        date,
        "Weekend trip and hotel booking",
        "Travel",
        2800 + (dateOfMonth % 5) * 1200 + monthIndex * 150,
        "expense",
      );
    }
  }

  return transactions.sort((left, right) => left.date.localeCompare(right.date));
}

