import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

/**
 * Runs a read against the local database whenever the screen gains focus,
 * so returning from a form always shows fresh data. Call `reload` after a write.
 */
export function useQuery<T>(load: (db: SQLiteDatabase) => Promise<T>, deps: unknown[] = []) {
  const db = useSQLiteContext();
  const [data, setData] = useState<T | undefined>(undefined);
  const latest = useRef(0);

  const reload = useCallback(async () => {
    const ticket = ++latest.current;
    const result = await load(db);
    // Drop results from an older call that finished late.
    if (ticket === latest.current) setData(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, ...deps]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { data, reload, db };
}
