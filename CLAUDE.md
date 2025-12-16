# CLAUDE.md - Coding Rules & Conventions

## Project Overview

**Project:** datn-publisher-cms (Manga Publisher CMS)
**Tech Stack:** React 19 + TypeScript + Vite + Ant Design + Zustand

---

## Architecture Pattern

### Component Architecture: Container/Presentational Pattern

Dự án sử dụng pattern **Container/Presentational** để tách biệt logic và UI:

```
┌─────────────────────────────────────────────────────────┐
│  Container Component (Page)                             │
│  - Data fetching (hooks)                                │
│  - State management                                     │
│  - Error/Loading handling                               │
│  - Event handlers                                       │
│  - Pass data & callbacks as props                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Presentational Component                               │
│  - Receive props with TypeScript interface              │
│  - UI rendering & styling                               │
│  - NO data fetching                                     │
│  - NO side effects (useEffect for data)                 │
│  - Can have local UI state (hover, toggle, etc.)        │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
src/
├── features/
│   └── [feature-name]/
│       ├── layouts/                    # Page containers
│       │   └── [PageName]/
│       │       ├── [PageName]Page.tsx  # Container component
│       │       ├── [PageName]Page.scss # Page-level styles (optional)
│       │       └── components/         # Page-specific presentational components
│       │           ├── [ComponentName].tsx
│       │           ├── [ComponentName].scss
│       │           └── index.ts        # Barrel export
│       ├── components/                 # Shared feature components
│       │   ├── [ComponentName].tsx
│       │   └── [ComponentName].scss
│       ├── hooks/                      # Custom hooks
│       ├── services/                   # API services
│       ├── types.ts                    # TypeScript types/interfaces
│       └── index.ts                    # Feature barrel export
├── components/                         # Global shared components
│   └── [ComponentName]/
│       ├── [ComponentName].tsx
│       ├── [ComponentName].scss
│       ├── types.ts                    # Component prop types
│       └── index.ts
└── ...
```

---

## Component Declaration Rules

### CRITICAL: Always Use Function Components with Default Export

```typescript
// ✅ CORRECT - Always use this pattern
export default function ComponentName() {
  return <div>...</div>;
}

// ✅ CORRECT - With props
export default function BooksList({ books, loading }: BooksListProps) {
  return <div>...</div>;
}

// ❌ FORBIDDEN - Arrow function
const ComponentName = () => { ... };
export default ComponentName;

// ❌ FORBIDDEN - Named export only
export function ComponentName() { ... }

// ❌ FORBIDDEN - Class component
class ComponentName extends React.Component { ... }
```

---

## Import Rules

### CRITICAL: Use Path Alias for Deep Imports

Sử dụng alias `@/` khi import có hơn 2 level (hơn 2 dấu `../`):

```typescript
// ✅ GOOD - Use alias for deep imports
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks";
import { useCategories } from "@/features/categories";
import type { Book } from "@/features/books/types";

// ✅ GOOD - Relative import for nearby files (1-2 levels)
import { helper } from "./utils";
import BooksList from "./components/BooksList";
import { useBooks } from "../hooks/useBooks";

// ❌ BAD - Too many levels without alias
import { Button } from "../../../../../components/ui/Button";
import { useDebounce } from "../../../../hooks";
import type { Book } from "../../../types";
```

### Import Order Convention

```typescript
// 1. React imports
import { useState, useEffect, useMemo } from "react";

// 2. Third-party libraries
import { Table, Button, Space } from "antd";
import { useNavigate } from "@tanstack/react-router";

// 3. Internal absolute imports (@/)
import { useDebounce } from "@/hooks";
import { useCategories } from "@/features/categories";

// 4. Relative imports - components (1-2 levels only)
import BooksList from "./components/BooksList";
import BooksFilterBar from "./components/BooksFilterBar";

// 5. Relative imports - hooks, services, utils (1-2 levels only)
import { useBooks } from "../hooks/useBooks";

// 6. Types (use `type` keyword)
import type { Book, BookSortOption } from "@/features/books/types";

// 7. Styles (always last)
import "./BooksPage.scss";
```

---

## Naming Conventions

### Files & Folders

| Type | Convention | Example |
|------|------------|---------|
| Page (Container) | `PascalCase` + `Page` suffix | `BooksPage.tsx`, `OrderDetailPage.tsx` |
| Presentational Component | `PascalCase` descriptive name | `BooksList.tsx`, `BooksFilterBar.tsx` |
| Hook | `camelCase` + `use` prefix | `useBooks.ts`, `useDebounce.ts` |
| Service | `camelCase` + `.service` suffix | `books.service.ts` |
| Types | `camelCase` or `types.ts` | `types.ts` |
| Styles | Same name as component + `.scss` | `BooksList.scss` |

### Component Naming

```typescript
// Container (Page) - handles data
BooksPage.tsx          // ✅ Good
BookPage.tsx           // ❌ Avoid (not descriptive enough)

// Presentational - describes what it renders
BooksList.tsx          // ✅ Good - renders list of books
BooksFilterBar.tsx     // ✅ Good - renders filter controls
BooksHeader.tsx        // ✅ Good - renders page header
BookCard.tsx           // ✅ Good - renders single book card
```

---

## TypeScript Rules

### CRITICAL: No `any` Type

```typescript
// ❌ FORBIDDEN
const handleSubmit = (values: any) => { ... }
const data: any = response.data;

// ✅ REQUIRED
interface BookFormValues {
  title: string;
  author: string;
  price: number;
}
const handleSubmit = (values: BookFormValues) => { ... }
```

### Props Interface Convention

```typescript
// ✅ Always define Props interface for components
interface BooksListProps {
  books: Book[];
  loading?: boolean;
  onBookClick?: (book: Book) => void;
}

// ✅ Export props interface for reusability
export interface BooksListProps { ... }

// ✅ Use descriptive names
interface BooksFilterBarProps {
  keyword: string;
  sortOption?: BookSortOption;
  categoryFilter?: string;
  onKeywordChange: (keyword: string) => void;
  onSortChange: (sort?: BookSortOption) => void;
  onCategoryChange: (category?: string) => void;
}
```

### Props Naming Conventions

```typescript
// Data props - noun describing the data
books: Book[]
order: OrderDetail
categories: Category[]

// Boolean props - is/has/can/should prefix
isLoading: boolean
hasError: boolean
canEdit: boolean
shouldRefresh: boolean

// Handler props - on + action
onSubmit: () => void
onClick: (id: string) => void
onFilterChange: (filters: Filters) => void

// Optional props - use ? suffix
className?: string
loading?: boolean
```

---

## Component Patterns

### Container Component (Page)

```typescript
// features/books/layouts/Books/BooksPage.tsx

import { useState, useMemo } from "react";
import { Alert, Spin } from "antd";
import { useDebounce } from "@/hooks";
import { useCategories } from "@/features/categories";
import BooksList from "./components/BooksList";
import BooksFilterBar from "./components/BooksFilterBar";
import BooksHeader from "./components/BooksHeader";
import { useBooks } from "../hooks/useBooks";
import type { BookSortOption } from "@/features/books/types";
import "./BooksPage.scss";

export default function BooksPage() {
  // 1. Hooks
  const [keyword, setKeyword] = useState("");
  const [sortOption, setSortOption] = useState<BookSortOption>();

  // 2. Data fetching
  const { books, isLoading, errorMessage, refetch } = useBooks({ filters });
  const { categories } = useCategories();

  // 3. Derived state
  const filteredBooks = useMemo(() => { ... }, [books]);

  // 4. Event handlers
  const handleSearch = (value: string) => { ... };
  const handleSortChange = (sort?: BookSortOption) => { ... };

  // 5. Render states
  if (errorMessage) {
    return <Alert type="error" message={errorMessage} />;
  }

  // 6. Main render - pass props to presentational components
  return (
    <div className="books-page">
      <BooksHeader onAddNew={handleAddNew} />
      <BooksFilterBar
        keyword={keyword}
        sortOption={sortOption}
        categories={categories}
        onKeywordChange={handleSearch}
        onSortChange={handleSortChange}
      />
      <BooksList
        books={filteredBooks}
        loading={isLoading}
        onBookClick={handleBookClick}
      />
    </div>
  );
}
```

### Presentational Component

```typescript
// features/books/layouts/Books/components/BooksList.tsx

import { Table } from "antd";
import type { Book } from "@/features/books/types";
import "./BooksList.scss";

export interface BooksListProps {
  books: Book[];
  loading?: boolean;
  onBookClick?: (book: Book) => void;
}

export default function BooksList({ books, loading = false, onBookClick }: BooksListProps) {
  // Only UI logic here
  const columns = [ ... ];

  return (
    <div className="books-list">
      <Table
        dataSource={books}
        columns={columns}
        loading={loading}
        onRow={(record) => ({
          onClick: () => onBookClick?.(record),
        })}
      />
    </div>
  );
}
```

### Barrel Export

```typescript
// features/books/layouts/Books/components/index.ts

export { default as BooksList } from "./BooksList";
export type { BooksListProps } from "./BooksList";

export { default as BooksFilterBar } from "./BooksFilterBar";
export type { BooksFilterBarProps } from "./BooksFilterBar";

export { default as BooksHeader } from "./BooksHeader";
export type { BooksHeaderProps } from "./BooksHeader";
```

---

## Styling Guidelines

### SCSS Class Naming (BEM-like)

```scss
// Component: BooksList
.books-list {
  // Block
  &__header {
    // Element
  }

  &__item {
    // Element
    &--active {
      // Modifier
    }
    &--disabled {
      // Modifier
    }
  }
}
```

### Scoped Styles

```typescript
// ✅ Each component has its own .scss file
// BooksList.tsx → BooksList.scss
// BooksFilterBar.tsx → BooksFilterBar.scss
```

---

## Do's and Don'ts

### ✅ DO

- Always use `export default function ComponentName()` pattern
- Use `@/` alias for imports with more than 2 levels
- Define TypeScript interface for ALL props
- Export prop types for reusability
- Keep presentational components pure (no side effects)
- Use descriptive component names
- Handle loading/error states in container
- Use `type` keyword for type-only imports
- Create barrel exports (index.ts) for cleaner imports

### ❌ DON'T

- Use `any` type anywhere
- Use arrow functions for component definitions
- Use class components
- Use deep relative imports (`../../../..`)
- Fetch data in presentational components
- Mix business logic with UI rendering
- Use inline styles (use SCSS)
- Create deeply nested component structures
- Skip prop validation

---

## Refactoring Checklist

When refactoring a Page component:

- [ ] Identify data fetching logic → keep in Page (Container)
- [ ] Identify UI rendering logic → extract to Presentational component
- [ ] Define Props interface with proper types
- [ ] Use `export default function` pattern
- [ ] Replace deep imports with `@/` alias
- [ ] Create separate .scss file for styling
- [ ] Create barrel export (index.ts)
- [ ] Remove all `any` types
- [ ] Add proper TypeScript types to all handlers
- [ ] Test that component renders correctly
- [ ] Verify no eslint/typescript errors

---

## Example Refactoring

### Before (Mixed concerns)

```typescript
// BooksPage.tsx - 200+ lines with everything mixed
function BooksPage() {
  const { books, isLoading } = useBooks();

  return (
    <div>
      {/* Header JSX */}
      {/* Filter JSX */}
      {/* Table JSX */}
      {/* Pagination JSX */}
    </div>
  );
}

export default BooksPage;
```

### After (Separated concerns)

```
layouts/Books/
├── BooksPage.tsx           # ~50 lines, data logic only
├── BooksPage.scss
└── components/
    ├── BooksHeader.tsx     # Header UI
    ├── BooksHeader.scss
    ├── BooksFilterBar.tsx  # Filter UI
    ├── BooksFilterBar.scss
    ├── BooksList.tsx       # Table UI
    ├── BooksList.scss
    └── index.ts
```

---

## Quick Reference

| Aspect | Rule |
|--------|------|
| Component Declaration | `export default function Name() {}` |
| Props | Always typed with interface |
| `any` | NEVER use |
| Arrow function components | NEVER use |
| Class components | NEVER use |
| Deep imports (>2 levels) | Use `@/` alias |
| Data fetching | Only in Container (Page) |
| Side effects | Only in Container (Page) |
| UI State (hover, toggle) | Allowed in Presentational |
| Styles | Separate .scss file per component |
