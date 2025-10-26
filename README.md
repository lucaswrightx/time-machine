# Time Machine - Encrypted Time-Locked Messaging System

A decentralized application that enables users to create encrypted messages that can only be decrypted after a specified timestamp. Built with Fully Homomorphic Encryption (FHE) technology powered by Zama's FHEVM protocol, ensuring complete privacy and security.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Advantages](#technical-advantages)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Problem Statement & Solutions](#problem-statement--solutions)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Development](#development)
  - [Deployment](#deployment)
- [Smart Contract Details](#smart-contract-details)
- [Frontend Application](#frontend-application)
- [Security Considerations](#security-considerations)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Overview

**Time Machine** is a blockchain-based time-locked messaging platform that leverages cutting-edge Fully Homomorphic Encryption (FHE) technology to provide unprecedented privacy and security. Users can create encrypted messages designated for specific recipients, which can only be decrypted after a predetermined unlock timestamp. This enables use cases such as scheduled announcements, digital time capsules, delayed information disclosure, and secure future communications.

Unlike traditional encrypted messaging systems, Time Machine ensures that even the recipient's address is encrypted on-chain, providing maximum privacy protection through FHEVM technology.

## Key Features

### Core Functionality

- **Time-Locked Encryption**: Messages remain encrypted until a specified unlock timestamp is reached
- **Fully Homomorphic Encryption**: Utilizes Zama's FHEVM protocol for computational operations on encrypted data
- **Encrypted Recipient Addresses**: Even recipient information is encrypted on-chain, ensuring complete privacy
- **Decentralized Architecture**: Built on Ethereum blockchain with no central point of failure
- **Web3 Wallet Integration**: Seamless connection via RainbowKit supporting multiple wallet providers
- **Message Management**: Create, view, and manage your time-locked messages through an intuitive interface
- **Access Control**: Only message creators can grant decryption access to recipients after unlock time
- **Event Tracking**: On-chain events for message creation and decryption authorization

### User Experience

- **Intuitive Interface**: Clean, modern UI built with React 19 and TypeScript
- **Real-time Updates**: Uses TanStack Query for efficient data fetching and caching
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Wallet Connection**: One-click wallet connection with popular Web3 wallets
- **Transaction Feedback**: Clear status indicators for blockchain transactions

## Technical Advantages

### 1. Fully Homomorphic Encryption (FHE)

- **True Privacy**: Computations can be performed on encrypted data without decryption
- **On-Chain Encryption**: Sensitive data remains encrypted on the blockchain
- **Future-Proof Security**: Resistant to quantum computing attacks
- **Zero-Knowledge Operations**: No intermediary needs to see plaintext data

### 2. Blockchain Benefits

- **Immutability**: Messages cannot be tampered with once created
- **Transparency**: All operations are verifiable on-chain
- **Censorship Resistance**: No central authority can block or delete messages
- **Decentralization**: No single point of failure or control

### 3. Smart Contract Security

- **Time-Based Access Control**: Enforced at the protocol level, not reliant on trusted parties
- **Ownership Verification**: Only creators can authorize recipient access
- **Input Validation**: Comprehensive checks prevent invalid state transitions
- **Event Logging**: All critical operations emit events for transparency

### 4. Developer-Friendly

- **Type-Safe**: Full TypeScript support across frontend and contract interactions
- **Modern Tooling**: Hardhat, Vite, and industry-standard development tools
- **Comprehensive Testing**: Test suites for both contracts and frontend
- **Easy Deployment**: Automated deployment scripts for multiple networks

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework for building interactive interfaces |
| **TypeScript** | 5.8.3 | Type-safe JavaScript for robust code |
| **Vite** | 7.1.6 | Next-generation frontend build tool |
| **Wagmi** | 2.17.0 | React hooks for Ethereum interactions |
| **RainbowKit** | 2.2.8 | Web3 wallet connection UI |
| **TanStack Query** | 5.89.0 | Powerful data synchronization library |
| **Viem** | 2.37.6 | TypeScript interface for Ethereum |
| **Ethers.js** | 6.15.0 | Ethereum library for blockchain interactions |

### Smart Contracts

| Technology | Version | Purpose |
|------------|---------|---------|
| **Solidity** | 0.8.24 | Smart contract programming language |
| **FHEVM** | 0.8.0 | Fully Homomorphic Encryption for EVM |
| **Hardhat** | 2.26.0 | Ethereum development environment |
| **TypeChain** | 8.3.2 | TypeScript bindings for smart contracts |
| **Hardhat Deploy** | 0.11.45 | Deployment management system |

### Development Tools

- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting
- **Solhint** - Solidity linter
- **Mocha** - Testing framework
- **Chai** - Assertion library
- **Hardhat Gas Reporter** - Gas usage analysis
- **Zama Relayer SDK** - FHE operations relay service

## Architecture

### Project Structure

```
time-machine/
├── contracts/                    # Solidity smart contracts
│   └── TimeLockedMessages.sol   # Main time-locked messaging contract
├── home/                        # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Header.tsx     # Application header
│   │   │   ├── MessageApp.tsx # Main app component
│   │   │   ├── MessageCreateForm.tsx # Message creation form
│   │   │   └── MessageList.tsx # Message display list
│   │   ├── config/            # Configuration files
│   │   │   ├── contracts.ts  # Contract ABI and addresses
│   │   │   └── wagmi.ts      # Wagmi configuration
│   │   ├── hooks/            # Custom React hooks
│   │   ├── styles/           # CSS styling
│   │   ├── App.tsx           # Root application component
│   │   └── main.tsx          # Application entry point
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
├── deploy/                   # Deployment scripts
│   └── deploy.ts            # Contract deployment script
├── test/                    # Smart contract tests
├── hardhat.config.ts        # Hardhat configuration
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

### System Flow

1. **User Connection**: User connects Web3 wallet via RainbowKit
2. **Message Creation**:
   - User enters message title, content, recipient address, and unlock time
   - Frontend encrypts content and recipient address using FHE
   - Transaction is sent to smart contract
   - Contract stores encrypted data on-chain
3. **Message Storage**:
   - Encrypted message stored in contract mapping
   - Message ID generated and associated with creator
   - Event emitted for indexing
4. **Time Lock**:
   - Smart contract enforces time-based access control
   - No one can decrypt before unlock timestamp
5. **Recipient Authorization**:
   - After unlock time, creator can grant access to recipient
   - FHE allows decryption permission without exposing plaintext
6. **Message Retrieval**:
   - Authorized recipients can decrypt and read messages
   - All operations logged on-chain

### Smart Contract Architecture

```
TimeLockedMessages Contract
├── Storage
│   ├── _messages: mapping(uint256 => Message)
│   ├── _messageIdsByCreator: mapping(address => uint256[])
│   └── _nextMessageId: uint256
├── Functions
│   ├── createMessage(...)      # Create encrypted time-locked message
│   ├── getMessage(...)          # Retrieve message details
│   ├── getMessageIdsByCreator(...)  # Get all messages by creator
│   └── allowRecipient(...)      # Grant decryption access after unlock
└── Events
    ├── MessageCreated          # Emitted on message creation
    └── DecryptionAllowed       # Emitted on access grant
```

## Problem Statement & Solutions

### Problems We Solve

#### 1. **Lack of True Privacy in Traditional Systems**

**Problem**: Conventional encrypted messaging systems require trust in third parties (servers, service providers) who can potentially access or censor messages.

**Solution**: By leveraging blockchain and FHE technology, Time Machine eliminates intermediaries. Messages are encrypted at the protocol level, and even the blockchain validators cannot access the plaintext data.

#### 2. **No Reliable Time-Locked Communications**

**Problem**: Existing time-delayed messaging services rely on centralized servers that could fail, be compromised, or shut down before the unlock time.

**Solution**: Smart contract-based time locks are enforced by the Ethereum blockchain's consensus mechanism, making them immutable and reliable. No central server can prevent message delivery.

#### 3. **Recipient Privacy Concerns**

**Problem**: Most blockchain applications expose recipient addresses publicly on-chain, compromising privacy.

**Solution**: Time Machine uses FHEVM to encrypt even the recipient's address, ensuring that only authorized parties can determine who will receive the message.

#### 4. **Trust Requirements in Future Communications**

**Problem**: Sending important information to be revealed in the future requires trusting custodians or escrow services.

**Solution**: Trustless smart contracts enforce the time-lock mechanism without requiring any third party to act honestly or remain operational.

#### 5. **Lack of Verifiable Scheduled Disclosure**

**Problem**: Companies and individuals need provable ways to schedule information disclosure (like announcements, wills, or time-sensitive data) without relying on trusted parties.

**Solution**: On-chain time-locked messages provide cryptographic proof of when messages were created and when they can be unlocked, creating an auditable trail.

### Use Cases

- **Digital Time Capsules**: Store memories or messages for future retrieval
- **Scheduled Announcements**: Pre-schedule confidential business announcements
- **Digital Wills**: Securely store instructions to be revealed at a future date
- **Delayed Information Disclosure**: Share sensitive information with time constraints
- **Confidential Scheduling**: Coordinate future events without premature disclosure
- **Research Data Embargoes**: Ensure research findings are not revealed before publication date
- **Secret Santa / Gift Reveals**: Lock gift messages until a specific date
- **Educational Use**: Release exam answers after test completion time

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20 or higher
- **npm**: Version 7.0.0 or higher
- **Git**: For cloning the repository
- **MetaMask** or another Web3 wallet: For interacting with the application
- **Sepolia ETH**: Test tokens for deployment and transactions (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/time-machine.git
   cd time-machine
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd home
   npm install
   cd ..
   ```

### Environment Setup

1. **Configure Hardhat variables**

   Set your mnemonic phrase for contract deployment:

   ```bash
   npx hardhat vars set MNEMONIC
   ```

   Set your Infura API key for network access:

   ```bash
   npx hardhat vars set INFURA_API_KEY
   ```

   (Optional) Set Etherscan API key for contract verification:

   ```bash
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

2. **Configure frontend environment**

   The contract address is already configured in `home/src/config/contracts.ts`. If you deploy a new contract, update this file with the new address.

### Development

#### Running Smart Contract Tests

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Run tests with coverage
npm run coverage

# Run tests on Sepolia testnet
npm run test:sepolia
```

#### Running Frontend Development Server

```bash
cd home
npm run dev
```

The application will be available at `http://localhost:5173`

#### Code Quality Checks

```bash
# Lint Solidity contracts
npm run lint:sol

# Lint TypeScript code
npm run lint:ts

# Format code with Prettier
npm run prettier:write

# Run all linting checks
npm run lint
```

### Deployment

#### Deploy to Local Hardhat Network

```bash
# Start local node
npm run chain

# In a new terminal, deploy contracts
npm run deploy:localhost
```

#### Deploy to Sepolia Testnet

```bash
# Deploy contracts
npm run deploy:sepolia

# Verify on Etherscan
npm run verify:sepolia
```

#### Deploy Frontend to Netlify

The project includes Netlify configuration. Simply connect your repository to Netlify, and it will automatically deploy from the `home` directory.

```bash
# Build frontend for production
cd home
npm run build
```

The built files will be in `home/dist/` directory.

## Smart Contract Details

### Contract Address

**Sepolia Testnet**: `0xc98Ef6d856367dF3BC2569DB25645CFA453C4126`

### Main Contract: TimeLockedMessages

#### Data Structure

```solidity
struct Message {
    address creator;           // Message creator address
    string title;              // Message title
    bytes encryptedContent;    // Encrypted message content
    eaddress encryptedRecipient; // Encrypted recipient address (FHE)
    uint256 createdAt;         // Creation timestamp
    uint256 unlockTimestamp;   // When message can be unlocked
    bool accessGranted;        // Whether access has been granted
    address grantedRecipient;  // Address that received access
}
```

#### Public Functions

##### `createMessage`

Creates a new time-locked encrypted message.

```solidity
function createMessage(
    string calldata title,
    bytes calldata encryptedContent,
    externalEaddress encryptedRecipient,
    bytes calldata inputProof,
    uint256 unlockTimestamp
) external returns (uint256)
```

**Parameters**:
- `title`: Plain text message title
- `encryptedContent`: Encrypted message content
- `encryptedRecipient`: Encrypted recipient address (FHE type)
- `inputProof`: Proof for FHE encryption
- `unlockTimestamp`: Unix timestamp when message can be unlocked

**Returns**: Message ID (uint256)

**Requirements**:
- Title must not be empty
- Encrypted content must not be empty
- Unlock time must be in the future
- Encrypted recipient must be valid FHE encrypted address

##### `getMessage`

Retrieves message details by ID.

```solidity
function getMessage(uint256 messageId) external view returns (
    address creator,
    string memory title,
    bytes memory encryptedContent,
    eaddress encryptedRecipient,
    uint256 createdAt,
    uint256 unlockTimestamp,
    bool accessGranted,
    address grantedRecipient
)
```

##### `getMessageIdsByCreator`

Gets all message IDs created by a specific address.

```solidity
function getMessageIdsByCreator(address creator)
    external
    view
    returns (uint256[] memory)
```

##### `allowRecipient`

Grants decryption access to recipient after unlock time.

```solidity
function allowRecipient(uint256 messageId, address recipient) external
```

**Requirements**:
- Message must exist
- Caller must be message creator
- Current time must be >= unlock timestamp
- Access must not have been granted already
- Recipient address must be valid

#### Events

```solidity
event MessageCreated(
    uint256 indexed messageId,
    address indexed creator,
    uint256 unlockTimestamp,
    uint256 createdAt
);

event DecryptionAllowed(
    uint256 indexed messageId,
    address indexed recipient
);
```

## Frontend Application

### Components

#### MessageApp

Main application component that coordinates the overall UI and state management.

#### Header

Navigation bar with wallet connection button using RainbowKit.

#### MessageCreateForm

Form interface for creating new time-locked messages with the following inputs:
- Message title
- Message content
- Recipient address
- Unlock date and time

Handles FHE encryption of content and recipient address before submitting to the blockchain.

#### MessageList

Displays all messages created by the connected wallet address with:
- Message title
- Creation date
- Unlock date
- Status (locked/unlocked)
- Access grant controls

### Custom Hooks

Custom React hooks for blockchain interactions:
- Contract read operations
- Contract write operations
- Transaction status tracking
- FHE encryption/decryption operations

### Styling

Modern, responsive UI with:
- Dark theme optimized for readability
- Card-based layout
- Smooth transitions and animations
- Mobile-first responsive design

## Security Considerations

### Smart Contract Security

- **Input Validation**: All user inputs are validated before processing
- **Access Control**: Functions are restricted to authorized users only
- **Time-Based Locks**: Enforced at the smart contract level
- **Reentrancy Protection**: No external calls before state changes
- **Integer Overflow**: Using Solidity 0.8+ with built-in overflow checks
- **FHE Security**: Leveraging Zama's audited FHEVM library

### Frontend Security

- **Wallet Security**: No private keys ever exposed to the application
- **Transaction Validation**: All transactions reviewed before signing
- **Input Sanitization**: User inputs sanitized to prevent injection attacks
- **HTTPS Only**: All communications encrypted in transit

### Best Practices for Users

1. **Verify Contract Address**: Always verify you're interacting with the correct contract
2. **Test with Small Amounts**: Test functionality with small values first
3. **Secure Your Wallet**: Use hardware wallets for high-value operations
4. **Verify Transactions**: Review all transaction details before signing
5. **Backup Messages**: Keep offline backups of important message IDs

## Future Roadmap

### Short Term (Q2 2025)

- [ ] **Message Editing**: Allow creators to update messages before unlock time
- [ ] **Message Cancellation**: Enable cancellation of messages before unlock
- [ ] **Batch Operations**: Create multiple messages in a single transaction
- [ ] **Message Templates**: Pre-defined templates for common use cases
- [ ] **Enhanced Notifications**: Email/push notifications for unlock events
- [ ] **Search & Filter**: Advanced search and filtering for message lists
- [ ] **Mobile App**: Native iOS and Android applications

### Medium Term (Q3-Q4 2025)

- [ ] **Multi-Recipient Messages**: Send to multiple recipients simultaneously
- [ ] **Conditional Unlocks**: Unlock based on conditions beyond just time
- [ ] **Message Attachments**: Support for encrypted file attachments
- [ ] **NFT Integration**: Convert time-locked messages into NFTs
- [ ] **IPFS Storage**: Decentralized storage for message content
- [ ] **Cross-Chain Support**: Deploy on multiple blockchain networks
- [ ] **Delegated Access**: Allow trusted parties to manage messages
- [ ] **Recovery Mechanisms**: Social recovery for lost access
- [ ] **Governance Token**: Community governance for protocol upgrades

### Long Term (2026+)

- [ ] **AI-Powered Scheduling**: Smart suggestions for unlock times
- [ ] **Integration APIs**: APIs for third-party service integrations
- [ ] **Enterprise Features**: Organization-level message management
- [ ] **Compliance Tools**: Tools for regulatory compliance in various jurisdictions
- [ ] **Zero-Knowledge Proofs**: Enhanced privacy with ZK-SNARKs
- [ ] **Quantum-Resistant Encryption**: Prepare for post-quantum cryptography
- [ ] **Decentralized Identity**: Integration with DID systems
- [ ] **Layer 2 Scaling**: Deploy on L2 solutions for lower fees
- [ ] **DAO Governance**: Transition to full DAO governance model
- [ ] **Marketplace**: Marketplace for time-locked digital assets

### Research & Innovation

- Exploring advanced FHE operations for more complex message logic
- Investigating cross-chain message delivery mechanisms
- Researching privacy-preserving message indexing
- Developing formal verification for smart contracts
- Analyzing gas optimization techniques for FHE operations

## Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Branch**: `git checkout -b feature/your-feature-name`
3. **Make Changes**: Implement your feature or bug fix
4. **Write Tests**: Ensure your code has appropriate test coverage
5. **Follow Code Style**: Run linters and formatters before committing
6. **Commit Changes**: `git commit -m "Add your descriptive commit message"`
7. **Push to Branch**: `git push origin feature/your-feature-name`
8. **Open Pull Request**: Submit a PR with a clear description of changes

### Development Guidelines

- Write clean, maintainable, and well-documented code
- Follow existing code style and conventions
- Add tests for new features and bug fixes
- Update documentation as needed
- Keep commits atomic and well-described
- Ensure all tests pass before submitting PR

### Areas for Contribution

- Bug fixes and issue resolution
- Feature development from roadmap
- Documentation improvements
- UI/UX enhancements
- Test coverage expansion
- Performance optimizations
- Translation to other languages

## License

This project is licensed under the **BSD-3-Clause-Clear License**. See the [LICENSE](LICENSE) file for complete details.

The BSD-3-Clause-Clear license is a permissive open-source license that allows you to use, modify, and distribute this software, with clear patent licensing terms.

## Support

### Getting Help

- **Documentation**: [FHEVM Documentation](https://docs.zama.ai/fhevm)
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/time-machine/issues)
- **Discussions**: [Join community discussions](https://github.com/yourusername/time-machine/discussions)

### Community

- **Zama Discord**: [Join Zama community](https://discord.gg/zama)
- **Twitter**: Follow us for updates [@yourusername]
- **Blog**: Read our latest articles and tutorials [Blog Link]

### Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Zama FHEVM GitHub](https://github.com/zama-ai/fhevm)

---

**Built with privacy in mind using Zama's FHEVM technology**

*Making the future of encrypted communications a reality today.*
