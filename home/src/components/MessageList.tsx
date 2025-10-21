import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { Contract, getAddress } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import { useEthersSigner } from '../hooks/useEthersSigner';
import '../styles/MessageList.css';

type MessageTuple = readonly [
  `0x${string}`,
  string,
  `0x${string}`,
  string,
  bigint,
  bigint,
  boolean,
  `0x${string}`
];

type ParsedMessage = {
  id: bigint;
  title: string;
  encryptedContent: `0x${string}`;
  encryptedRecipient: string;
  createdAt: bigint;
  unlockTimestamp: bigint;
  accessGranted: boolean;
  grantedRecipient: `0x${string}`;
  unlockReached: boolean;
};

export function MessageList() {
  const { address } = useAccount();
  const signerPromise = useEthersSigner();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipientInputs, setRecipientInputs] = useState<Record<string, string>>({});
  const [pendingMessage, setPendingMessage] = useState<bigint | null>(null);

  const { data: idResponse, refetch: refetchIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMessageIdsByCreator',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const messageIds = useMemo(() => (idResponse ? [...idResponse] : []), [idResponse]);

  const contracts = useMemo(
    () =>
      messageIds.map(id => ({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getMessage' as const,
        args: [id] as const,
      })),
    [messageIds]
  );

  const { data: messagesData, refetch: refetchMessages, isLoading } = useReadContracts({
    contracts,
    allowFailure: false,
    query: { enabled: contracts.length > 0 },
  });

  const parsedMessages = useMemo<ParsedMessage[]>(() => {
    if (!messagesData) return [];
    const now = BigInt(Math.floor(Date.now() / 1000));

    return messagesData
      .map((entry, index) => {
        if (!entry) return null;
        const tuple = entry as MessageTuple;
        const id = messageIds[index];
        return {
          id,
          title: tuple[1],
          encryptedContent: tuple[2],
          encryptedRecipient: tuple[3],
          createdAt: tuple[4],
          unlockTimestamp: tuple[5],
          accessGranted: tuple[6],
          grantedRecipient: tuple[7],
          unlockReached: now >= tuple[5],
        };
      })
      .filter((value): value is ParsedMessage => Boolean(value));
  }, [messageIds, messagesData]);

  const handleAllow = async (message: ParsedMessage) => {
    setFeedback(null);
    setError(null);

    if (!message.unlockReached) {
      setError('Unlock time is not reached yet.');
      return;
    }

    const inputValue = recipientInputs[message.id.toString()] ?? '';
    let normalizedRecipient: string;
    try {
      normalizedRecipient = getAddress(inputValue);
    } catch (parseError) {
      setError('Enter a valid recipient address to allow.');
      return;
    }

    const signer = await signerPromise;
    if (!signer) {
      setError('Unable to access signer interface.');
      return;
    }

    try {
      setPendingMessage(message.id);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.allowRecipient(message.id, normalizedRecipient);
      await tx.wait();

      setFeedback(`Decryption permission granted to ${normalizedRecipient}.`);
      setRecipientInputs(prev => ({ ...prev, [message.id.toString()]: '' }));
      await Promise.all([refetchMessages(), refetchIds()]);
    } catch (txError) {
      console.error('Failed to allow decryptor', txError);
      setError(txError instanceof Error ? txError.message : 'Transaction failed');
    } finally {
      setPendingMessage(null);
    }
  };

  if (!address) {
    return <div className="message-placeholder">Connect your wallet to view stored messages.</div>;
  }

  if (isLoading) {
    return <div className="message-placeholder">Loading messages...</div>;
  }

  if (parsedMessages.length === 0) {
    return <div className="message-placeholder">No messages scheduled yet.</div>;
  }

  return (
    <section className="message-list-section">
      <h2 className="section-title">Stored Messages</h2>
      {feedback && <div className="alert alert-success">{feedback}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="message-grid">
        {parsedMessages.map(message => {
          const idKey = message.id.toString();
          const unlockDate = new Date(Number(message.unlockTimestamp) * 1000).toLocaleString();
          const createdDate = new Date(Number(message.createdAt) * 1000).toLocaleString();
          const status = message.accessGranted
            ? 'Access granted'
            : message.unlockReached
            ? 'Ready to allow'
            : 'Locked';

          return (
            <article key={idKey} className="message-card">
              <header className="message-card-header">
                <h3>{message.title || 'Untitled message'}</h3>
                <span className={`status-pill ${status.replace(/\s/g, '-').toLowerCase()}`}>{status}</span>
              </header>

              <dl className="message-meta">
                <div>
                  <dt>Message ID</dt>
                  <dd className="mono">{idKey}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{createdDate}</dd>
                </div>
                <div>
                  <dt>Unlocks</dt>
                  <dd>{unlockDate}</dd>
                </div>
                <div>
                  <dt>Granted Recipient</dt>
                  <dd>{message.grantedRecipient === '0x0000000000000000000000000000000000000000' ? '—' : message.grantedRecipient}</dd>
                </div>
              </dl>

              <div className="code-block">
                <p className="code-label">Encrypted content</p>
                <code className="mono small-text">{message.encryptedContent}</code>
              </div>

              <div className="code-block">
                <p className="code-label">Encrypted decryptor handle</p>
                <code className="mono small-text">{message.encryptedRecipient}</code>
              </div>

              {!message.accessGranted && (
                <div className="allow-panel">
                  <label className="form-label">
                    Recipient address to allow
                    <input
                      type="text"
                      className="form-input"
                      value={recipientInputs[idKey] ?? ''}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setRecipientInputs(prev => ({ ...prev, [idKey]: event.target.value }))
                      }
                      placeholder="0x..."
                    />
                  </label>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => handleAllow(message)}
                    disabled={pendingMessage === message.id}
                  >
                    {pendingMessage === message.id ? 'Authorizing...' : 'Allow Decryption'}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
