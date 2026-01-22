import type { FormEvent, KeyboardEvent, RefObject } from 'react';

/**
 * カスタムキーコンボの定義
 */
export interface CustomKeyCombo {
  key: 'Enter';
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

/**
 * 送信キーの組み合わせ
 * - 'Enter': 単純なEnter
 * - 'Cmd+Enter': macOSはCmd、Windows/LinuxはCtrl
 * - 'Ctrl+Enter': Ctrl+Enter（全OS共通）
 * - 'Shift+Enter': Shift+Enter
 * - 'Alt+Enter': Alt+Enter
 * - CustomKeyCombo: カスタム組み合わせ
 */
export type SubmitKeyCombo =
  | 'Enter'
  | 'Cmd+Enter'
  | 'Ctrl+Enter'
  | 'Shift+Enter'
  | 'Alt+Enter'
  | CustomKeyCombo;

/**
 * useSubmitJPのオプション
 */
export interface UseSubmitJPOptions {
  /**
   * 送信を許可するキーの組み合わせ
   * @default ['Enter']
   */
  submitKeys?: SubmitKeyCombo[];

  /**
   * フォーム送信時のコールバック
   */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;

  /**
   * IME変換中のEnterキー押下時のコールバック
   */
  onCompositionEnter?: () => void;

  /**
   * 無効化フラグ
   * @default false
   */
  disabled?: boolean;
}

/**
 * useSubmitJPの戻り値
 */
export interface UseSubmitJPReturn {
  /**
   * formタグに適用するprops
   */
  formProps: {
    ref: RefObject<HTMLFormElement>;
    onKeyDown: (event: KeyboardEvent<HTMLFormElement>) => void;
    onCompositionStart: () => void;
    onCompositionEnd: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  };

  /**
   * 現在IME変換中かどうか
   */
  isComposing: boolean;

  /**
   * プログラム的に送信をトリガー
   */
  triggerSubmit: () => void;
}
