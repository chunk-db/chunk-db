import { UUID } from '@chunk-db/core';
import { ChunkDBProvider } from '@chunk-db/react';
import { Paper } from '@material-ui/core';
import React, { useState } from 'react';

import { ListPanel } from './panels/ListPanel';
import { TodoPanel } from './panels/TodoPanel';
import { db } from './store/store';
import { ListID } from './store/store.types';

export const TodoApp = () => {
    const [lists, setLists] = useState<ListID[]>([]);

    return (
        <div className="app">
            <ChunkDBProvider value={db}>
                <div className="todo-container">
                    <Paper variant="outlined">
                        <TodoPanel lists={lists} />
                    </Paper>
                </div>
                <div className="list-container">
                    <Paper variant="outlined">
                        <ListPanel lists={lists} onLists={setLists} />
                    </Paper>
                </div>
            </ChunkDBProvider>
            <style jsx>{`
                .app {
                    display: flex;
                    min-width: 900px;
                    max-width: 1100px;
                    justify-content: space-between;
                }

                .todo-container,
                .list-container {
                    flex: 1 1 50%;
                    padding: 6px;
                }
            `}</style>
        </div>
    );
};
