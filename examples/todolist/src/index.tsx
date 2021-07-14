import { ChunkDBProvider } from '@chunk-db/react';
import React, { useState } from 'react';

import { Footer } from './components/Footer';
import { Main } from './components/Main';
import { Panels } from './components/Panels';
import { DevToolsUI } from './panels/devTools';
import { ListPanel } from './panels/list/ListPanel';
import { TodoPanel } from './panels/todo/TodoPanel';
import { db } from './store/store';
import { ListID } from './store/store.types';
import { Header } from './widgets/Header';

export const TodoApp = () => {
    const [lists, setLists] = useState<ListID[]>([]);

    return (
        <ChunkDBProvider value={db}>
            <Header />
            <Main>
                <Panels>
                    <TodoPanel lists={lists} />
                    <ListPanel lists={lists} onLists={setLists} />
                    <DevToolsUI />
                </Panels>
            </Main>
            <Footer />
        </ChunkDBProvider>
    );
};