import { ChunkDBProvider } from '@chunk-db/react';
import React, { useEffect, useState } from 'react';

import { DevToolsUI, TodoApp } from '../../src/todolist';
import { db } from '../../src/todolist/store/store';

const App = () => {
    const [devToolsDB, setDevToolsDB] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('-= Set DB for DevTools =-');
            setDevToolsDB(db);
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <div className="app">
            <div className="todolist-container">
                <ChunkDBProvider value={db}>
                    <TodoApp />
                </ChunkDBProvider>
            </div>
            <div className="devtools-container">
                <DevToolsUI db={devToolsDB} />
            </div>
            <style jsx>{`
                .app {
                    display: flex;
                    width: 900px;
                    margin: 10px auto;
                    justify-content: space-between;
                }

                .todolist-container {
                    flex: 1 1 40%;
                }

                .devtools-container {
                    flex: 1 1 60%;
                }
            `}</style>
        </div>
    );
};

export default App;
