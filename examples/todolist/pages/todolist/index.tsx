import React from 'react';
import { DevToolsUI, TodoApp } from '../../src/todolist';

const App = () => {
    return (
        <div className="app">
            <div className="todolist-container">
                <TodoApp />
            </div>
            <div className="devtools-container">
                <DevToolsUI />
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
