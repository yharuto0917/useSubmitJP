/**
 * 現在のプラットフォームがmacOSかどうかを判定
 */
export function isMacOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}
