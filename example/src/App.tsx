import { useState } from 'react';
import { useSubmitJP, SubmitKeyCombo } from 'use-submit-jp';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [submitKey, setSubmitKey] = useState<SubmitKeyCombo>('Enter');

  const { formProps, isComposing } = useSubmitJP({
    submitKeys: [submitKey],
    onSubmit: (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const message = formData.get('message') as string;
      if (message.trim()) {
        setMessages((prev) => [...prev, message]);
        form.reset();
      }
    },
  });

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>useSubmitJP Example</h1>

      <p style={{ color: '#666', marginBottom: 20 }}>
        日本語入力で変換確定時のEnterでは送信されません。
        <br />
        変換が完了した状態で送信キーを押すと送信されます。
      </p>

      <div style={{ marginBottom: 20 }}>
        <label>
          送信キー設定：
          <select
            value={submitKey as string}
            onChange={(e) => setSubmitKey(e.target.value as SubmitKeyCombo)}
            style={{ marginLeft: 10, padding: '4px 8px' }}
          >
            <option value="Enter">Enter</option>
            <option value="Cmd+Enter">Cmd+Enter (macOS) / Ctrl+Enter (Win)</option>
            <option value="Ctrl+Enter">Ctrl+Enter</option>
            <option value="Shift+Enter">Shift+Enter</option>
          </select>
        </label>
      </div>

      <form {...formProps} style={{ marginBottom: 20 }}>
        <textarea
          name="message"
          placeholder="メッセージを入力..."
          rows={4}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 16,
            boxSizing: 'border-box',
            borderColor: isComposing ? '#f0ad4e' : '#ccc',
            borderWidth: 2,
            borderStyle: 'solid',
            borderRadius: 4,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span style={{ color: isComposing ? '#f0ad4e' : '#999', fontSize: 14 }}>
            {isComposing ? '変換中...' : '入力待ち'}
          </span>
          <button
            type="submit"
            style={{
              padding: '8px 20px',
              fontSize: 16,
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            送信
          </button>
        </div>
      </form>

      <div>
        <h2>送信されたメッセージ</h2>
        {messages.length === 0 ? (
          <p style={{ color: '#999' }}>まだメッセージがありません</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map((msg, i) => (
              <li
                key={i}
                style={{
                  padding: 10,
                  marginBottom: 8,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 4,
                }}
              >
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
