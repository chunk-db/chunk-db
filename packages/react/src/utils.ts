import { useCallback, useState } from 'react';

export function useForceReload() {
    const [, updateState] = useState<any>();
    return useCallback(() => updateState({}), []);
}
