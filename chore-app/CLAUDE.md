# Chore App

A React-based chore tracking application for teams with calendar view, recurring tasks, and team member assignment.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **date-fns** for date manipulation
- **CSS Modules** for component-scoped styling
- **localStorage** for client-side persistence

## Project Structure

```
src/
├── components/          # React components (one folder per component)
│   ├── Calendar/        # Monthly calendar grid with chore indicators
│   ├── ChoreForm/       # Modal form for creating/editing chores
│   ├── ChoreList/       # Daily chore list for selected date
│   ├── Sidebar/         # Navigation and filter controls
│   └── TeamManager/     # Team member CRUD interface
├── hooks/
│   └── useLocalStorage.ts   # Generic localStorage persistence hook
├── utils/
│   ├── recurrence.ts    # Recurring date calculation logic
│   └── storage.ts       # Storage helper functions (legacy)
├── App.tsx              # Root component, all state lives here
├── types.ts             # TypeScript type definitions
├── sampleData.ts        # Demo data for development
└── main.tsx             # Application entry point
```

## Key Files

| File | Purpose |
|------|---------|
| `src/types.ts` | All domain types: `Chore`, `TeamMember`, `Recurrence`, `ChoreInstance` |
| `src/App.tsx` | Root component with all application state (lines 21-32) |
| `src/hooks/useLocalStorage.ts` | Persistence hook used for chores and team members |
| `src/utils/recurrence.ts` | Pure functions for recurring chore date calculations |

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (default: localhost:5173)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
```

## Data Model

**Chore** (`src/types.ts:12-23`)
- id, title, description, assigneeId, category, priority
- dueDate, recurrence, completedDates[], createdAt

**TeamMember** (`src/types.ts:25-29`)
- id, name, color

**ChoreInstance** (`src/types.ts:36-40`)
- Computed type: chore + specific date + completion status

## State Architecture

All state is managed in `App.tsx` and passed down via props:
- Data: `chores`, `teamMembers` (persisted to localStorage)
- UI: `currentDate`, `selectedDate`, `view`, `filters`, `showChoreForm`, `editingChore`

Components communicate upward via callback props (`on*` naming convention).

## Component Patterns

Each component folder contains:
- `ComponentName.tsx` - React component
- `ComponentName.module.css` - Scoped styles

Props interfaces are defined at the top of each component file.

## Testing

No test framework is currently configured. To add tests:
1. Install Vitest: `npm install -D vitest @testing-library/react`
2. Add test script to package.json
3. Create `*.test.tsx` files alongside components

## Additional Documentation

When working on specific areas, consult these guides:

| Topic | File |
|-------|------|
| Architecture & Patterns | `.claude/docs/architectural_patterns.md` |

### Quick Pattern Reference

- **Handlers**: `handle*` prefix (e.g., `handleAddChore`)
- **Callbacks**: `on*` prefix (e.g., `onSave`, `onClose`)
- **Helpers**: `get*` prefix (e.g., `getMember`)
- **State updates**: Always immutable (spread, map, filter)
- **Date format**: `'yyyy-MM-dd'` string format throughout
