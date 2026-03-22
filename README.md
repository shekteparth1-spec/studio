# Harvest Haven

This is a NextJS property listing platform for unique farmhouses and resorts.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## 🛠 Git Troubleshooting

### Resolving "Divergent Branches" Error
If you encounter the error `fatal: Need to specify how to reconcile divergent branches` when running `git pull`, it means your local and remote branches have different histories.

**To fix this, run the following command in your terminal:**

```bash
git config pull.rebase false
```

*This tells Git to create a merge commit when pulling, which is the standard way to reconcile divergent branches. After running this, try your `git pull origin main` again.*

## Features

- **Unique Stays**: Handpicked farmhouses and luxury resorts.
- **AI-Powered Listings**: Descriptions generated using Genkit AI.
- **Secure Payments**: Razorpay integration for property listings.
- **Modern UI**: Nature-inspired design with ShadCN components.
