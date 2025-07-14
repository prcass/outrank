# Git Commands Quick Reference

## Creating Savepoints

### Before Starting Work
```bash
git add .
git commit -m "Working state before [description of work]"
```

### After Completing Features
```bash
git add .
git commit -m "✅ [Feature description] - brief summary of changes"
```

### Create Stable Tags
```bash
git tag -a "stable-v[version]" -m "Description of stable state"
```

## Viewing History

### See Recent Commits
```bash
git log --oneline -10
```

### See All Tags
```bash
git tag -l
```

### See Changes in a Commit
```bash
git show [commit-hash]
```

## Rollback Options

### Rollback to Previous Commit (CAUTION - Loses changes)
```bash
git reset --hard HEAD~1
```

### Rollback to Specific Commit
```bash
git reset --hard [commit-hash]
```

### Rollback to Stable Tag
```bash
git checkout stable-ui-v2.1
```

### Rollback Just One File
```bash
git checkout HEAD~1 game.js
```

### Create Branch for Experiments
```bash
git checkout -b experiment-branch
# ... make changes ...
git checkout main  # Return to main branch
```

## Current Stable Versions
- `stable-ui-v2.1` - All UI fixes complete, responsive design working
- Add new stable versions here as you create them

## Emergency Rollback
If everything breaks:
```bash
git checkout stable-ui-v2.1
```

This will return you to the last known working state.