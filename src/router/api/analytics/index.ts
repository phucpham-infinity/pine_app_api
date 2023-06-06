import express from "express";

export const AnalyticsRouter = express.Router();

AnalyticsRouter.route("/analytics/summary").get((_, res) => {
  return res.json({
    status: "ok",
    data: {
      income: 12000,
      expenses: 8000,
      account_balances: [
        { account_id: "12345", balance: "15000" },
        { account_id: "67890", balance: "5000" },
      ],
    },
  });
});

AnalyticsRouter.route("/analytics/income-expense").get((_, res) => {
  return res.json({
    status: "ok",
    data: {
      income: [
        {
          category: "Sales",
          amount: 10000,
          subcategories: [
            { subcategory: "Product A", amount: 6000 },
            { subcategory: "Product B", amount: 4000 },
          ],
        },
        { category: "Investments", amount: 2000 },
      ],
      expenses: [
        { category: "Salaries", amount: 5000 },
        { category: "Rent", amount: 2000 },
        { category: "Utilities", amount: 1000 },
      ],
    },
  });
});
