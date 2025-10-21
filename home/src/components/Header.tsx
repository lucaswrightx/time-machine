import { ConnectButton } from '@rainbow-me/rainbowkit';
import '../styles/Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Time-Locked Messages</h1>
            <p className="header-subtitle">Encrypted delivery with on-chain release controls</p>
          </div>
          <ConnectButton chainStatus="icon" accountStatus="address" />
        </div>
      </div>
    </header>
  );
}
