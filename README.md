# use-submit-jp

English | [日本語](./READMEjp.md)

React hook to distinguish IME composition Enter from form submit Enter.

## Installation

```bash
npm install use-submit-jp
```

## Problem

When typing Japanese (or other CJK languages) in a form, pressing Enter to confirm the IME composition can accidentally submit the form. This hook solves that problem by detecting IME composition state and only allowing form submission when not composing.

## Usage

### Basic Usage

```tsx
import { useSubmitJP } from 'use-submit-jp';

function ChatForm() {
  const { formProps, isComposing } = useSubmitJP({
    onSubmit: (e) => {
      e.preventDefault();
      // Handle form submission
    }
  });

  return (
    <form {...formProps}>
      <textarea name="message" />
      <button type="submit">Send</button>
    </form>
  );
}
```

### With Modifier Keys (Slack-like)

```tsx
import { useSubmitJP } from 'use-submit-jp';

function SlackLikeForm() {
  const { formProps } = useSubmitJP({
    submitKeys: ['Cmd+Enter'],  // Cmd+Enter on macOS, Ctrl+Enter on Windows/Linux
    onSubmit: (e) => {
      e.preventDefault();
      // Handle form submission
    }
  });

  return (
    <form {...formProps}>
      <textarea name="message" placeholder="Press Cmd+Enter to send" />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Multiple Submit Keys

```tsx
import { useSubmitJP } from 'use-submit-jp';

function FlexibleForm() {
  const { formProps } = useSubmitJP({
    submitKeys: ['Cmd+Enter', 'Ctrl+Enter', 'Shift+Enter'],
  });

  return (
    <form {...formProps}>
      <textarea name="message" />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Custom Key Combination

```tsx
import { useSubmitJP } from 'use-submit-jp';

function CustomForm() {
  const { formProps } = useSubmitJP({
    submitKeys: [
      { key: 'Enter', ctrlKey: true, shiftKey: true }
    ],
  });

  return (
    <form {...formProps}>
      <textarea name="message" placeholder="Press Ctrl+Shift+Enter to send" />
      <button type="submit">Send</button>
    </form>
  );
}
```

## API

### `useSubmitJP(options?)`

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `submitKeys` | `SubmitKeyCombo[]` | `['Enter']` | Key combinations that trigger form submission |
| `onSubmit` | `(event: FormEvent) => void` | - | Callback when form is submitted |
| `onCompositionEnter` | `() => void` | - | Callback when Enter is pressed during IME composition |
| `disabled` | `boolean` | `false` | Disable the hook |

#### Submit Key Options

| Key | Description |
|-----|-------------|
| `'Enter'` | Simple Enter (no modifiers) |
| `'Cmd+Enter'` | Cmd+Enter on macOS, Ctrl+Enter on Windows/Linux |
| `'Ctrl+Enter'` | Ctrl+Enter (all platforms) |
| `'Shift+Enter'` | Shift+Enter |
| `'Alt+Enter'` | Alt+Enter (Option+Enter on macOS) |
| `CustomKeyCombo` | Custom combination with `ctrlKey`, `metaKey`, `shiftKey`, `altKey` |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `formProps` | `object` | Props to spread on the form element |
| `isComposing` | `boolean` | Whether IME is currently composing |
| `triggerSubmit` | `() => void` | Programmatically trigger form submission |

## How It Works

This hook uses a hybrid approach to detect IME composition:

1. **`event.nativeEvent.isComposing`** - Modern browsers provide this property on keyboard events
2. **CompositionEvent handlers** - Fallback using `compositionstart` and `compositionend` events

When Enter is pressed during IME composition, the form submission is blocked. Only when not composing and the correct key combination is pressed, the form is submitted using `requestSubmit()`.

## Requirements

- React >= 18.0.0

## License

MIT
