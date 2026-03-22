# Harvest Haven

This is a NextJS property listing platform for unique farmhouses and resorts.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Git Troubleshooting

### Resolving "Divergent Branches" Error
If you encounter the error `fatal: Need to specify how to reconcile divergent branches` when running `git pull`, it means your local and remote branches have different histories. 

Run one of the following commands in your terminal to tell Git how to handle this:

**Option 1: Merge (Recommended for most cases)**
This will create a merge commit to join the histories.
```bash
git config pull.rebase false
```

**Option 2: Rebase (For a cleaner history)**
This will apply your local changes on top of the remote changes.
```bash
git config pull.rebase true
```

After running one of the above, try your pull again:
```bash
git pull origin main
```
