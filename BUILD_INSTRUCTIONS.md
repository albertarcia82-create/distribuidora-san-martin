# 🏗️ BUILD INSTRUCTIONS - Distribuidora San Martín

## Quick Start (Windows)

### Step 1: Check Progress
Compilation is running in background. Check status:
```bash
# View output log (if running locally)
cargo build --release
```

### Step 2: Wait for Build to Complete
Expected time: **10-15 minutes** (first build)

Build completes when you see:
```
Finished `release` profile [optimized] target(s) in XXs
```

### Step 3: Find Installer
Once build completes, installer will be at:
```
src-tauri/target/release/bundle/nsis/distribuidora-san-martin_0.3.0_x64-setup.exe
```

### Step 4: Create GitHub Release (Optional)
```bash
gh release create v0.3.0 \
  src-tauri/target/release/bundle/nsis/*.exe \
  --title "Distribuidora San Martín v0.3.0" \
  --notes "✅ Feature Complete Release"
```

---

## Troubleshooting

### Build Hangs
If cargo hangs for >20 min:
1. Press Ctrl+C to cancel
2. Run: `cargo clean`
3. Try again: `cargo build --release`

### Out of Disk Space
Need ~2GB free for build. Check:
```bash
# Windows
Get-Volume | Where-Object {$_.DriveLetter -eq 'C'}
```

### Linker Errors
Already using GNU toolchain to avoid MSVC issues.
If still fails: Try Mac/Linux build.

---

## What's Being Built

**Backend (Rust):**
- 11+ Tauri commands
- SQLite with 7 tables
- JWT authentication
- All business logic

**Frontend (React):**
- 8 optimized components
- 8 CSS files with dark mode
- Already compiled to 274KB

**Installer:**
- NSIS auto-installer
- Auto-start on install
- Uninstaller support

---

## After Build Complete

1. Test the installer
2. Run testing checklist (see TESTING.md)
3. Create GitHub Release
4. Share with team

---

**Status: Building... ⏳**
