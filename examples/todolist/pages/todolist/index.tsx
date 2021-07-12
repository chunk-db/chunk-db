import { ChunkDBProvider } from '@chunk-db/react';
import React, { useEffect } from 'react';

import { TodoApp } from '../../src';
import { db } from '../../src/store/store';

const App = () => {
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <ChunkDBProvider value={db}>
            <TodoApp />
        </ChunkDBProvider>
    );
};

export default App;
