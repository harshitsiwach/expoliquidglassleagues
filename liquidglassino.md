
# Expo Liquid Glass UI Components Documentation

This document outlines the structure and usage of the "Liquid Glass" UI components found in this project. The implementation relies heavily on the `@expo/ui/swift-ui` library and a centralized React Context for state management.

## Table of Contents

1.  [Project Structure Overview](#project-structure-overview)
2.  [Core Data Management (`AppContext.tsx`)](#core-data-management-appcontexttsx)
3.  [Data Types (`types.ts`)](#data-types-typests)
4.  [Reusable UI Components](#reusable-ui-components)
    -   [Button](#button)
    -   [ContextMenu](#contextmenu)
    -   [Gauge](#gauge)
    -   [Slider](#slider)
    -   [DateTimePicker](#datetimepicker)
    -   [Picker](#picker)
    -   [Switch](#switch)
    -   [DisclosureGroup](#disclosuregroup)
    -   [Modifiers (e.g., `glassEffect`)](#modifiers)

---

## 1. Project Structure Overview

The "Liquid Glass" feature is not a single component but a collection of components and examples demonstrating a specific visual style.

-   **`components/liquid-glass/`**: This directory contains all the relevant files.
-   **`AppContext.tsx`**: A React Context provider that manages the state for the entire demo screen. This is key for understanding how data flows through the components.
-   **`types.ts`**: Contains all TypeScript interfaces for the application state and data models (e.g., `Task`, `UserProfile`).
-   **Section Components (`*Section.tsx`)**: These are not individual reusable components but rather parts of a larger screen that showcase various UI elements from `@expo/ui/swift-ui`. They are excellent examples of how to compose the basic components into a full UI.

---

## 2. Core Data Management (`AppContext.tsx`)

This file provides a centralized state management solution for the UI demo.

### `AppProvider`

Wrap your component tree with `AppProvider` to give all children components access to the shared state.

**Usage:**

```tsx
import { AppProvider } from './components/liquid-glass/AppContext';

export default function App() {
  return (
    <AppProvider>
      {/* Your screen components here */}
    </AppProvider>
  );
}
```

### `AppContext`

Use the `useContext` hook with `AppContext` to access state and updater functions.

**State and Functions available:**

-   `profile`, `updateProfile`
-   `tasks`, `addTask`, `toggleTask`, `deleteTask`
-   `settings`, `updateSettings`
-   `selectedDate`, `setSelectedDate`
-   And many more for UI and dashboard state.

**Usage:**

```tsx
import { use } from 'react';
import { AppContext } from './components/liquid-glass/AppContext';
import { AppState } from './components/liquid-glass/types';

function MyComponent() {
  const { tasks, toggleTask } = use(AppContext) as AppState;

  // Now you can use tasks and toggleTask
}
```

---

## 3. Data Types (`types.ts`)

This file is crucial for understanding the data structures used throughout the components.

-   **`interface Task`**: Defines the structure for a task item.
    ```typescript
    interface Task {
      id: number;
      title: string;
      description: string;
      emoji: string;
      completed: boolean;
      priority: "low" | "medium" | "high";
      dueDate: Date;
      createdAt: Date;
    }
    ```
-   **`interface UserProfile`**: Defines the user's profile data.
-   **`interface AppSettings`**: Defines application settings.
-   **`interface AppState`**: Defines the entire shape of the context state.

---

## 4. Reusable UI Components

These are the core building blocks from `@expo/ui/swift-ui` used to create the liquid glass UI.

### Button

A standard button component with multiple visual styles. The "glass" effect is achieved through the `variant` prop.

**Key Variants:**

-   `default`
-   `bordered`
-   `plain`
-   `glass`: **The key "Liquid Glass" style.**
-   `glassProminent`: A more pronounced glass effect.
-   `borderedProminent`
-   `borderless`

**Usage:**

```tsx
import { Button } from '@expo/ui/swift-ui';

<Button variant="glass">Glass Button</Button>
<Button variant="glassProminent">Prominent Glass</Button>
```

### ContextMenu

A component that presents a menu of options when long-pressed. It is composed of `ContextMenu.Items` and `ContextMenu.Trigger`.

**Usage:**

```tsx
import { ContextMenu, Button, Submenu, Switch } from '@expo/ui/swift-ui';

<ContextMenu>
  <ContextMenu.Items>
    <Button systemImage="info.circle">Task Overview</Button>
    <Submenu button={<Button systemImage="eye">View Options</Button>}>
        <Switch label="Auto Refresh" value={true} />
    </Submenu>
  </ContextMenu.Items>
  <ContextMenu.Trigger>
    <Button systemImage="ellipsis.circle.fill">Menu</Button>
  </ContextMenu.Trigger>
</ContextMenu>
```

### Gauge

A component to display progress or a value within a range. It can be circular or linear.

**Key Props:**

-   `current`: An object with `{ value: number, label: string }`.
-   `type`: `"circular"`, `"circularCapacity"`, `"default"`, `"linear"`, `"linearCapacity"`.
-   `color`: A single color string or an array of strings for a gradient.

**Usage:**

```tsx
import { Gauge } from '@expo/ui/swift-ui';
import { frame } from '@expo/ui/build/swift-ui/modifiers';

<Gauge
  current={{ value: 0.75, label: "75%" }}
  modifiers={[frame({ width: 100, height: 100 })]}
  color="green"
  type="circular"
/>
```

### Slider

A classic slider for selecting a value from a continuous range.

**Key Props:**

-   `value`: The current value of the slider (between 0 and 1).
-   `onValueChange`: A function that is called when the value changes.

**Usage:**

```tsx
import { Slider } from '@expo/ui/swift-ui';
import { useState } from 'react';

const [sliderValue, setSliderValue] = useState(0.5);

<Slider value={sliderValue} onValueChange={setSliderValue} />
```

### DateTimePicker

A component for selecting dates and times.

**Key Props:**

-   `onDateSelected`: Callback function with the selected date.
-   `displayedComponents`: `"date"`, `"hourAndMinute"`, or `"dateAndTime"`.
-   `variant`: `"compact"`, `"graphical"`, or `"wheel"`.

**Usage:**

```tsx
import { DateTimePicker } from '@expo/ui/swift-ui';

<DateTimePicker
  onDateSelected={(date) => console.log(date)}
  displayedComponents="dateAndTime"
  variant="graphical"
/>
```

### Picker

A control for selecting a value from a list of options.

**Key Props:**

-   `label`: A string to label the picker.
-   `options`: An array of strings for the choices.
-   `selectedIndex`: The index of the currently selected option.
-   `onOptionSelected`: Callback when an option is chosen.
-   `variant`: `"segmented"`, `"menu"`.

**Usage:**

```tsx
import { Picker } from '@expo/ui/swift-ui';

<Picker
  label="Filter Tasks"
  options={["all", "pending", "completed"]}
  selectedIndex={0}
  onOptionSelected={({ nativeEvent: { index } }) => console.log(index)}
  variant="segmented"
/>
```

### Switch

A simple toggle switch.

**Key Props:**

-   `value`: Boolean state of the switch.
-   `onValueChange`: Callback when the value changes.
-   `label`: Optional text label.

**Usage:**

```tsx
import { Switch } from '@expo/ui/swift-ui';

<Switch
  value={true}
  label="Push Notifications"
  onValueChange={(value) => console.log(value)}
/>
```

### DisclosureGroup

A collapsible container to show or hide content.

**Key Props:**

-   `isExpanded`: Boolean to control the expanded state.
-   `onStateChange`: Callback when the state changes.
-   `label`: The visible label for the group.

**Usage:**

```tsx
import { DisclosureGroup, Text } from '@expo/ui/swift-ui';

<DisclosureGroup label="Advanced Settings">
  <Text>Here is some content that can be hidden.</Text>
</DisclosureGroup>
```

### Modifiers

Modifiers are special functions that can be passed to the `modifiers` prop of most `@expo/ui/swift-ui` components to alter their appearance. The `glassEffect` is central to the liquid glass style.

**`glassEffect` Modifier**

This modifier applies a frosted glass effect to a component.

**Usage:**

```tsx
import { Group, Image } from '@expo/ui/swift-ui';
import { glassEffect } from '@expo/ui/build/swift-ui/modifiers';

<Group
  modifiers={[
    glassEffect({ glass: { variant: "regular", interactive: true } }),
  ]}
>
  <Image systemName="applelogo" size={50} />
</Group>
```
