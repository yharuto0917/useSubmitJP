import type { KeyboardEvent } from 'react';
import type { SubmitKeyCombo, CustomKeyCombo } from '../types';
import { isMacOS } from './platform';

/**
 * キーイベントが指定されたキーコンボにマッチするか判定
 */
export function matchesSubmitKey(
  event: KeyboardEvent,
  submitKeys: SubmitKeyCombo[] = ['Enter']
): boolean {
  if (event.key !== 'Enter') return false;
  return submitKeys.some((combo) => matchesCombo(event, combo));
}

function matchesCombo(
  event: KeyboardEvent,
  combo: SubmitKeyCombo
): boolean {
  if (typeof combo === 'string') {
    return matchesPredefinedCombo(event, combo);
  }
  return matchesCustomCombo(event, combo);
}

function matchesPredefinedCombo(
  event: KeyboardEvent,
  combo: string
): boolean {
  const { ctrlKey, metaKey, shiftKey, altKey } = event;

  switch (combo) {
    case 'Enter':
      return !ctrlKey && !metaKey && !shiftKey && !altKey;

    case 'Cmd+Enter': {
      const isMac = isMacOS();
      if (isMac) {
        return metaKey && !ctrlKey && !shiftKey && !altKey;
      }
      return ctrlKey && !metaKey && !shiftKey && !altKey;
    }

    case 'Ctrl+Enter':
      return ctrlKey && !metaKey && !shiftKey && !altKey;

    case 'Shift+Enter':
      return shiftKey && !ctrlKey && !metaKey && !altKey;

    case 'Alt+Enter':
      return altKey && !ctrlKey && !metaKey && !shiftKey;

    default:
      return false;
  }
}

function matchesCustomCombo(
  event: KeyboardEvent,
  combo: CustomKeyCombo
): boolean {
  const { ctrlKey, metaKey, shiftKey, altKey } = event;

  return (
    (combo.ctrlKey === undefined || combo.ctrlKey === ctrlKey) &&
    (combo.metaKey === undefined || combo.metaKey === metaKey) &&
    (combo.shiftKey === undefined || combo.shiftKey === shiftKey) &&
    (combo.altKey === undefined || combo.altKey === altKey)
  );
}
