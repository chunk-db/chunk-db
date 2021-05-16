import React from 'react';

import { DevToolsUI, TodoApp } from '../../src/todolist';
import { ChunkDBProvider } from '@chunk-db/react';
import { db } from '../../src/todolist/store/store';

const App = () => {
    return (
        <div className="app">
            <ChunkDBProvider value={db}>
                <div className="todolist-container">
                    <TodoApp />
                </div>
                <div className="devtools-container">
                    <DevToolsUI db={db} />
                </div>
            </ChunkDBProvider>
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
