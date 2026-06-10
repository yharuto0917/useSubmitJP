import {
  useState,
  useCallback,
  useRef,
  type KeyboardEvent,
  type FormEvent,
} from 'react';
import type { UseSubmitJPOptions, UseSubmitJPReturn } from './types';
import { matchesSubmitKey } from './utils/keyCombo';

// Enterがボタン自体の押下を意味するinput type（暗黙送信の抑止対象から除外）
const BUTTON_INPUT_TYPES = ['submit', 'button', 'reset', 'image'];

/**
 * 日本語入力時のIME変換確定Enterとフォーム送信Enterを区別するフック
 *
 * @example
 * ```tsx
 * const { formProps, isComposing } = useSubmitJP({
 *   submitKeys: ['Cmd+Enter'],
 *   onSubmit: (e) => {
 *     e.preventDefault();
 *     // 送信処理
 *   }
 * });
 *
 * return (
 *   <form {...formProps}>
 *     <textarea name="message" />
 *     <button type="submit">送信</button>
 *   </form>
 * );
 * ```
 */
export function useSubmitJP(
  options: UseSubmitJPOptions = {}
): UseSubmitJPReturn {
  const {
    submitKeys = ['Enter'],
    onSubmit,
    onCompositionEnter,
    disabled = false,
  } = options;

  const [isComposing, setIsComposing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLFormElement>) => {
      if (disabled) return;
      if (event.key !== 'Enter') return;

      // IME変換中かどうかを判定（ハイブリッドアプローチ）
      // 1. nativeEvent.isComposing（モダンブラウザ）
      // 2. keyCode === 229（Safariはcompositionendがkeydownより先に発火し、
      //    変換確定EnterのisComposingがfalseになるため、レガシーな229で検出）
      // 3. React stateによるフォールバック
      const composing =
        event.nativeEvent.isComposing ||
        event.nativeEvent.keyCode === 229 ||
        isComposing;

      if (composing) {
        // IME変換中のEnterは無視
        onCompositionEnter?.();
        return;
      }

      // キーコンボがマッチするか判定
      if (matchesSubmitKey(event, submitKeys)) {
        event.preventDefault();
        formRef.current?.requestSubmit();
        return;
      }

      // マッチしないEnterでも、input要素ではブラウザの暗黙送信が走るため抑止する
      // （textarea等は改行なのでそのまま通す）
      // ボタン系のinputはEnterがボタン自体の押下を意味するため対象外
      const target = event.target;
      if (
        target instanceof HTMLInputElement &&
        !BUTTON_INPUT_TYPES.includes(target.type)
      ) {
        event.preventDefault();
      }
    },
    [disabled, isComposing, submitKeys, onCompositionEnter]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      onSubmit?.(event);
    },
    [onSubmit]
  );

  const triggerSubmit = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  return {
    formProps: {
      ref: formRef,
      onKeyDown: handleKeyDown,
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
      onSubmit: handleSubmit,
    },
    isComposing,
    triggerSubmit,
  };
}
