import React from 'react';

import { DevToolsUI, TodoApp } from '../../src/todolist';
import { db } from '../../src/todolist/store/store';

const App = () => {
    return (
        <div className="app">
            <div className="todolist-container">
                <TodoApp />
            </div>
            <div className="devtools-container">
                <DevToolsUI db={db}/>
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
