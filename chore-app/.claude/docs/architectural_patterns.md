# Architectural Patterns

## State Management: Lifted State Pattern

All application state is centralized in the root `App.tsx` component:
- **Data state**: `chores`, `teamMembers` (persisted via `useLocalStorage`)
- **UI state**: `currentDate`, `selectedDate`, `view`, `showChoreForm`, `editingChore`, `filters`

Reference: `src/App.tsx:21-32`

Child components receive state as props and communicate changes via callback handlers. No Context API or Redux is used.

## Data Flow: Unidirectional Props Pattern

```
App (Root State)
├── Sidebar       → receives: filters, teamMembers, view
├── Calendar      → receives: choreInstances, selectedDate
├── ChoreList     → receives: filtered instances for selected date
├── ChoreForm     → receives: chore to edit (or null for new)
└── TeamManager   → receives: teamMembers
```

- Data flows DOWN via props
- Events flow UP via `on*` callback props
- No sibling-to-sibling communication

## Persistence: Custom Hook Pattern

The `useLocalStorage<T>` hook encapsulates localStorage persistence:
- Generic type parameter for any data type
- Returns `[value, setter]` tuple (mirrors `useState` API)
- Auto-serializes on state changes via `useEffect`
- Handles parse errors gracefully

Reference: `src/hooks/useLocalStorage.ts:1-23`

## Computed Data Pattern

Derived state is computed at the App level before passing to children:
- `choreInstances`: Generated from chores using `getChoreInstancesForMonth()`
- `filteredInstances`: Further filtered based on active UI filters

Reference: `src/App.tsx:34-47`

This prevents duplicate computation across multiple components.

## Domain Logic: Pure Utility Functions

Complex business logic is isolated in pure utility functions:
- `getChoreInstancesForMonth()` - Generates chore instances for calendar display
- `generateRecurringDates()` - Handles daily/weekly recurrence calculations
- `getNextOccurrence()` - Finds next occurrence after a given date

Reference: `src/utils/recurrence.ts`

## Naming Conventions

### Event Handlers
Internal handlers use `handle*` prefix:
- `handleAddChore`, `handleUpdateChore`, `handleDeleteChore`
- `handleToggleComplete`, `handleEditChore`, `handleSubmit`

Reference: `src/App.tsx:49-100`

### Callback Props
Callback props use `on*` prefix:
- `onViewChange`, `onFiltersChange`, `onNewChore`
- `onDateChange`, `onSelectDate`, `onToggleComplete`
- `onEdit`, `onDelete`, `onClose`, `onSave`

### Helper Functions
Component-local helpers use `get*` prefix:
- `getChoresForDay()` - `src/components/Calendar/Calendar.tsx:41`
- `getMemberColor()` - `src/components/Calendar/Calendar.tsx:46`
- `getMember()` - `src/components/ChoreList/ChoreList.tsx:37`

## Component Structure Pattern

Each component follows this structure:
1. Imports (React, types, styles)
2. Props interface definition (`*Props`)
3. Static data (labels, options)
4. Component function with destructured props
5. Local state/helpers
6. JSX return

Reference: Any component in `src/components/`

## Props Interface Pattern

Every component defines a typed props interface:
```typescript
interface ComponentNameProps {
  // Data props first
  data: DataType
  items: ItemType[]
  // Callback props second (on* prefix)
  onAction: (param: Type) => void
  onClose: () => void
}
```

References:
- `src/components/Sidebar/Sidebar.tsx:12-19`
- `src/components/Calendar/Calendar.tsx:16-23`
- `src/components/ChoreForm/ChoreForm.tsx:6-12`

## Immutable State Updates

All state updates use immutable patterns:
- **Add**: `[...array, newItem]`
- **Update**: `array.map(item => item.id === id ? updated : item)`
- **Delete**: `array.filter(item => item.id !== id)`
- **Toggle nested**: See `handleToggleComplete` at `src/App.tsx:64-77`

## Form Handling Pattern

Forms follow a consistent pattern:
1. Multiple `useState` calls for each field
2. `useEffect` to populate from editing state (edit mode)
3. `handleSubmit` with validation
4. Reset state on successful submission

References:
- `src/components/ChoreForm/ChoreForm.tsx:16-83`
- `src/components/TeamManager/TeamManager.tsx:28-44`

## CSS Modules Pattern

All components use CSS Modules for scoped styling:
- Import: `import styles from './Component.module.css'`
- Usage: `className={styles.container}`
- Conditional: `` className={`${styles.item} ${isActive ? styles.active : ''}`} ``

## Type Definitions

### Centralized Domain Types
All domain types are defined in `src/types.ts`:
- Union types: `Category`, `Priority`, `RecurrenceType`
- Entity interfaces: `Chore`, `TeamMember`, `Recurrence`
- Computed types: `ChoreInstance` (combines Chore + date + completion)

### Local UI Types
UI-specific types are defined locally in components:
- `View` type in `src/App.tsx:12`
- `Filters` interface in `src/App.tsx:14-18`

## ID Generation Pattern

Simple ID generation used consistently:
```typescript
const generateId = () => Math.random().toString(36).substring(2, 11)
```

References:
- `src/components/ChoreForm/ChoreForm.tsx:14`
- `src/components/TeamManager/TeamManager.tsx:11`

## Date Handling Pattern

Consistent date string format throughout: `'yyyy-MM-dd'`

Uses `date-fns` library for all date operations:
- Parsing: `parseISO(dateString)`
- Formatting: `format(date, 'yyyy-MM-dd')`
- Comparisons: `isBefore()`, `isAfter()`, `isSameDay()`
- Range: `startOfMonth()`, `endOfMonth()`, `eachDayOfInterval()`
