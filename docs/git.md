# Git Version Control Guide

## Latest Changes
The following changes need to be committed:
1. Static site generator improvements:
   - Added proper image animation handling
   - Remove admin interface in static builds
   - Updated documentation

2. Documentation updates:
   - Updated CMS guide with static site generation info
   - Revised file structure documentation
   - Added development notes

## Commit Structure
```bash
git add .
git commit -m "feat: enhance static site generation

- Add proper image animation handling
- Remove admin interface in static builds
- Update documentation with static site info
- Improve file structure documentation"
git push origin main
```

## Files Modified
- static-generator.js (Added admin button removal)
- docs/CMS_GUIDE.md (Updated with static site info)
- docs/git.md (This file)

## Common Git Commands
```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "type: description"

# Push changes
git push origin branch-name

# Create and switch to new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name
```

## Commit Message Types
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Formatting, missing semi colons, etc
- refactor: Code restructuring
- test: Adding missing tests
- chore: Maintenance tasks

## VS Code Git Integration
If git commands stop working in VS Code:
1. Try Command Palette (Cmd+Shift+P) > "Developer: Reload Window"
2. If that fails: Restart VS Code
3. Last resort: Use command line git commands
