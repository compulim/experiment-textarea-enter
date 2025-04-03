import { FormEventHandler, memo, useCallback, useState, type KeyboardEventHandler } from 'react';

export default memo(function App() {
  const [submittedValue, setSubmittedValue] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const handleInput = useCallback<FormEventHandler<HTMLTextAreaElement>>(
    event => {
      setValue(event.currentTarget.value);
    },
    [setValue]
  );

  const handleKeyDownAndKeyPress = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(event => {
    // Shift+Enter adds a new line
    // Enter requests related form submission
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();

      if ('form' in event.target && event.target.form instanceof HTMLFormElement) {
        event.target?.form?.requestSubmit();
      }
    }
  }, []);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    event => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entries = (formData as any).entries() as Iterable<readonly [string, string]>;

      setSubmittedValue(JSON.stringify(Object.fromEntries(Array.from(entries)), null, 2));
      setValue('');
    },
    [setSubmittedValue, setValue]
  );

  const handleSubmitWithDelayClear = useCallback<FormEventHandler<HTMLFormElement>>(
    event => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entries = (formData as any).entries() as Iterable<readonly [string, string]>;

      setSubmittedValue(JSON.stringify(Object.fromEntries(Array.from(entries)), null, 2));
      setTimeout(() => setValue(''), 0);
    },
    [setSubmittedValue, setValue]
  );

  return (
    <div>
      <h1>Text area</h1>
      <h2>onKeyDown</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          autoComplete="off"
          name="send box"
          onInput={handleInput}
          onKeyDown={handleKeyDownAndKeyPress}
          spellCheck={false}
          value={value}
        />
      </form>
      <h2>onKeyPress</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          autoComplete="off"
          name="send box"
          onInput={handleInput}
          onKeyPress={handleKeyDownAndKeyPress}
          spellCheck={false}
          value={value}
        />
      </form>
      <h2>onKeyDown with delay clearing</h2>
      <form onSubmit={handleSubmitWithDelayClear}>
        <textarea
          autoComplete="off"
          name="send box"
          onInput={handleInput}
          onKeyDown={handleKeyDownAndKeyPress}
          spellCheck={false}
          value={value}
        />
      </form>
      <hr />
      <h2>Submitted value</h2>
      <pre>{submittedValue}</pre>
    </div>
  );
});
