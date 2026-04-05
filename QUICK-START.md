# 🚀 Quick Start Guide

## Easiest Commands for Users

### 1️⃣ **Interactive Mode (Recommended)**
```bash
folder-tidy
```
Just run it and select what you want from the menu!

---

### 2️⃣ **One-Command Organization**

#### Organize current folder
```bash
folder-tidy tidy
```

#### Organize specific folder
```bash
folder-tidy tidy --target ~/Downloads
```

#### Preview before organizing
```bash
folder-tidy tidy --dry-run
```

#### Undo last operation
```bash
folder-tidy undo
```

---

### 3️⃣ **Short NPM Scripts (if using locally)**

If you cloned this repo, use these easy commands:

```bash
npm run organize       # Organize current folder
npm run clean         # Same as organize
npm run preview       # Preview changes (dry-run)
npm run undo          # Undo last operation
npm run watch         # Watch for new files
npm run config        # Create/edit config
npm run help          # Show help
npm start             # Interactive menu
```

---

### 4️⃣ **Super Short Commands**

Once installed globally, you can use these everywhere:

```bash
# Most Common
folder-tidy                    # Interactive menu
folder-tidy tidy               # Organize now
folder-tidy tidy --dry-run    # Preview first
folder-tidy undo               # Restore files

# Advanced
folder-tidy tidy --target .    # Organize specific path
folder-tidy watch              # Auto-organize new files
folder-tidy config             # Set custom rules
folder-tidy --help             # Show all options
```

---

## 📖 Real-World Examples

### Scenario 1: Time to Clean Downloads
```bash
folder-tidy tidy --target ~/Downloads
```
✅ Done! Files organized in seconds.

### Scenario 2: "Wait, I want to preview first"
```bash
folder-tidy tidy --target ~/Downloads --dry-run
```
📋 See what will happen without moving anything.

### Scenario 3: "Oh no, undo that!"
```bash
folder-tidy undo
```
↩️ All files restored to original locations.

### Scenario 4: "Keep my Downloads clean automatically"
```bash
folder-tidy watch --target ~/Downloads
```
👀 New files auto-organized as they arrive.

---

## 🎯 Cheat Sheet

| What You Want | Command |
|---|---|
| Menu | `folder-tidy` |
| Organize | `folder-tidy tidy` |
| Preview | `folder-tidy tidy --dry-run` |
| Undo | `folder-tidy undo` |
| Watch | `folder-tidy watch` |
| Config | `folder-tidy config` |
| Help | `folder-tidy --help` |

---

## 💡 Pro Tips

1. **Always preview first**
   ```bash
   folder-tidy tidy --dry-run
   folder-tidy tidy                # Then run for real
   ```

2. **Watch while working**
   ```bash
   folder-tidy watch --target ~/Downloads
   ```

3. **Save a preset**
   ```bash
   folder-tidy config --target ~/Downloads
   # Customize, save, and it remembers!
   ```

4. **Show detailed info**
   ```bash
   folder-tidy tidy --verbose
   ```

---

## 🆘 Need Help?

```bash
folder-tidy --help              # General help
folder-tidy tidy --help         # Organize help
folder-tidy undo --help         # Undo help
```

---

That's it! Keep your folders tidy! 🧹✨
