## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd guestpedia-assignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Live Demo

```
https://mini-kanban.vercel.app/
```

## Project Structure

```
 app/
   ├── components/
   │   ├── Kanban.tsx          # Main Kanban component
   │   ├── Column.tsx          # Column component
   │   ├── Task.tsx            # Task component
   │   ├── TaskModal.tsx       # Task details modal
   │   └── PriorityIcon.tsx    # Priority indicator
   ├── hooks/
   │   ├── useTaskManager.ts   # Task CRUD operations
   │   ├── useTaskInput.ts     # Task input handling
   │   ├── useDragAndDrop.ts   # Drag and drop logic
   │   ├── useTaskModal.ts     # Modal state management
   │   └── useLocalStorage.ts  # LocalStorage abstraction
   ├── layouts/
   │   └── BaseLayout.tsx      # Base layout wrapper
   ├── lib/
   │   └── utils.ts            # Utility functions
   └── types/
       └── type.ts             # TypeScript type definitions
```

## Architecture & Design Decisions

### State Management

- **Custom Hooks Pattern**: Separated concerns into focused custom hooks
- **useTaskManager**: Handles all CRUD operations for tasks
- **useTaskInput**: Manages task creation input states
- **useDragAndDrop**: Encapsulates drag-and-drop logic
- **useTaskModal**: Controls modal visibility and selected task state

## Known Issues

### Timi Limitations

While a 7-day timeline is generally sufficient for completing this project, I faced some unforeseen commitments that limited my focus and development time. As a result, certain parts of the application—particularly in terms of polish and UX—did not reach the level of quality I initially aimed for.

## Improvement

With additional time, my main priority would be to improve the Task Modal component, focusing on better user interaction, cleaner structure, and a more seamless editing experience—closer to what’s expected in tools like Trello or Notion.
