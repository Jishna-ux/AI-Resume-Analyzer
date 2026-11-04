import { useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/format';

// Runs an async loader on mount (and whenever `deps` change) and tracks loading / error state.
// `reload()` runs it again; `setData()` lets a page update the list locally (e.g. after a delete).
export default function useFetch(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loader()
      .then((data) => !cancelled && setState({ data, loading: false, error: '' }))
      .catch((error) => !cancelled && setState((previous) => ({ ...previous, loading: false, error: getErrorMessage(error) })));
    return () => {
      cancelled = true;
    };
    // The caller decides when to reload through `deps`; the loader itself is recreated on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = () => {
    setState((previous) => ({ ...previous, loading: true, error: '' }));
    setAttempt((value) => value + 1);
  };
  const setData = (data) => setState((previous) => ({ ...previous, data }));

  return { ...state, setData, reload };
}
