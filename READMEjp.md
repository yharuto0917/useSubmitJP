# use-submit-jp

[English](./README.md) | 日本語

日本語入力時のIME変換確定EnterとフォームSubmit Enterを区別するReact Hooksライブラリです。

## 課題

日本語（または他のCJK言語）をフォームに入力する際、IME変換を確定するためにEnterキーを押すと、意図せずフォームが送信されてしまうことがあります。このフックはIMEの変換状態を検出し、変換中でない場合のみフォーム送信を許可することでこの問題を解決します。

## インストール

```bash
npm install use-submit-jp
```

## 使い方

### 基本的な使い方

```tsx
import { useSubmitJP } from 'use-submit-jp';

function ChatForm() {
  const { formProps, isComposing } = useSubmitJP({
    onSubmit: (e) => {
      e.preventDefault();
      // 送信処理
    }
  });

  return (
    <form {...formProps}>
      <textarea name="message" />
      <button type="submit">送信</button>
    </form>
  );
}
```

### 修飾キーを使用（Slack風）

```tsx
import { useSubmitJP } from 'use-submit-jp';

function SlackLikeForm() {
  const { formProps } = useSubmitJP({
    submitKeys: ['Cmd+Enter'],  // macOSではCmd+Enter、Windows/LinuxではCtrl+Enter
    onSubmit: (e) => {
      e.preventDefault();
      // 送信処理
    }
  });

  return (
    <form {...formProps}>
      <textarea name="message" placeholder="Cmd+Enterで送信" />
      <button type="submit">送信</button>
    </form>
  );
}
```

### 複数の送信キーを許可

```tsx
import { useSubmitJP } from 'use-submit-jp';

function FlexibleForm() {
  const { formProps } = useSubmitJP({
    submitKeys: ['Cmd+Enter', 'Ctrl+Enter', 'Shift+Enter'],
  });

  return (
    <form {...formProps}>
      <textarea name="message" />
      <button type="submit">送信</button>
    </form>
  );
}
```

### カスタムキーの組み合わせ

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
      <textarea name="message" placeholder="Ctrl+Shift+Enterで送信" />
      <button type="submit">送信</button>
    </form>
  );
}
```

## API

### `useSubmitJP(options?)`

#### オプション

| オプション | 型 | デフォルト | 説明 |
|-----------|---|----------|------|
| `submitKeys` | `SubmitKeyCombo[]` | `['Enter']` | フォーム送信をトリガーするキーの組み合わせ |
| `onSubmit` | `(event: FormEvent) => void` | - | フォーム送信時のコールバック |
| `onCompositionEnter` | `() => void` | - | IME変換中にEnterが押された時のコールバック |
| `disabled` | `boolean` | `false` | フックを無効化 |

#### 送信キーオプション

| キー | 説明 |
|-----|------|
| `'Enter'` | 単純なEnter（修飾キーなし） |
| `'Cmd+Enter'` | macOSではCmd+Enter、Windows/LinuxではCtrl+Enter |
| `'Ctrl+Enter'` | Ctrl+Enter（全プラットフォーム共通） |
| `'Shift+Enter'` | Shift+Enter |
| `'Alt+Enter'` | Alt+Enter（macOSではOption+Enter） |
| `CustomKeyCombo` | `ctrlKey`、`metaKey`、`shiftKey`、`altKey`を使ったカスタム組み合わせ |

#### 戻り値

| プロパティ | 型 | 説明 |
|----------|---|------|
| `formProps` | `object` | form要素に展開するprops |
| `isComposing` | `boolean` | 現在IME変換中かどうか |
| `triggerSubmit` | `() => void` | プログラムから送信をトリガー |

## 仕組み

このフックはIME変換を検出するためにハイブリッドアプローチを使用しています：

1. **`event.nativeEvent.isComposing`** - モダンブラウザはキーボードイベントでこのプロパティを提供
2. **CompositionEventハンドラ** - `compositionstart`と`compositionend`イベントを使用したフォールバック

IME変換中にEnterが押された場合、フォーム送信はブロックされます。変換中でなく、正しいキーの組み合わせが押された場合のみ、`requestSubmit()`を使用してフォームが送信されます。

## 動作例

`example`ディレクトリにVite+Reactの使用例があります。

```bash
cd example
npm install
npm run dev
```

## 要件

- React >= 18.0.0

## ライセンス

MIT
