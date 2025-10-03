# GitHub Copilot Instructions - Iwanna Project

## 📚 Documentation First!

Before any code changes, read:
1. `docs/prd.md` - Product Requirements (SINGLE SOURCE OF TRUTH)
2. `docs/logs.md` - Change history
3. `docs/TROUBLESHOOTING.md` - Known issues

## 🏗️ Tech Stack

- React 18 + TypeScript + Vite
- Supabase (PostgreSQL, Auth)
- shadcn/ui + Tailwind CSS
- React Router v6

## 👥 User Roles

```typescript
type Role = 'admin' | 'vendor' | 'user'

// Vendor activation flow:
// register → active: false → /business/pending
// admin activates → active: true → /adminko
```

## 🗄️ Key Tables

```sql
profiles (id, role, active)
brands (id, owner_id → profiles)
spas (id, brand_id → brands)
spa_amenities (spa_id, amenity_id, custom_description)
leads (id, spa_id, status)
```

## ✅ Rules

### Rule 1: Update docs/prd.md after changes
### Rule 2: Log ALL changes in docs/logs.md
### Rule 3: Check TROUBLESHOOTING.md before fixing bugs

## 📁 Structure

```
src/
├── components/     # React components
├── contexts/       # AuthContext
├── hooks/          # useBrands, useCountries
├── services/       # brandService, spaService
└── types/          # TypeScript types
```

## 🔴 Current Issues

**CRITICAL: Slow page loads (>10s)**
- Profile queries hanging
- See `docs/TROUBLESHOOTING.md` for details

## 📝 Commit Format

```
feat: add brands page
fix: profile loading issue
docs: update PRD
refactor: optimize AuthContext
perf: add database indexes
```

## 🎯 Before Suggesting Code

- [ ] Read relevant documentation
- [ ] Check if issue is known
- [ ] Ensure solution aligns with PRD
- [ ] Remind user to update docs

Full docs: `docs/prd.md`
