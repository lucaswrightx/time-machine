import { useState } from 'react';
import { Header } from './Header';
import { MessageCreateForm } from './MessageCreateForm';
import { MessageList } from './MessageList';
import '../styles/MessageApp.css';

type ActiveTab = 'create' | 'messages';

export function MessageApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('create');

  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <div className="tab-header">
          <button
            type="button"
            className={activeTab === 'create' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('create')}
          >
            Create Message
          </button>
          <button
            type="button"
            className={activeTab === 'messages' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('messages')}
          >
            My Messages
          </button>
        </div>
        <div className="tab-panel">
          {activeTab === 'create' ? <MessageCreateForm /> : <MessageList />}
        </div>
      </main>
    </div>
  );
}
