import { ChunkDBProvider } from '@chunk-db/react';
import React, { useState } from 'react';

import { CommonModals } from './common-modals/CommonModals';
import { Footer } from './components/Footer';
import { Main } from './components/Main';
import { Panels } from './components/Panels';
import { DevToolsUI } from './panels/devTools';
import { ListPanel } from './panels/list/ListPanel';
import { TodoPanel } from './panels/todo/TodoPanel';
import { db } from './store/store';
import { IList } from './store/store.types';
import { Header } from './widgets/Header';

export const TodoApp = () => {
    const [selectedLists, setSelectedLists] = useState<IList[]>([]);

    return (
        <ChunkDBProvider value={db}>
            <CommonModals>
                <Header />
                <Main>
                    <Panels>
                        <TodoPanel selectedLists={selectedLists} />
                        <ListPanel selectedLists={selectedLists} onChangeSelectedLists={setSelectedLists} />
                        <DevToolsUI />
                    </Panels>
                </Main>
                <Footer />
            </CommonModals>
        </ChunkDBProvider>
    );
};
