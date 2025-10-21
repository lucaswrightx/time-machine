import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { Contract, Wallet, getAddress, hexlify, isHexString, toUtf8Bytes } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import '../styles/MessageCreateForm.css';

type SubmissionState = 'idle' | 'encrypting' | 'waiting' | 'success';

function decodePayload(input: string): `0x${string}` {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Encrypted message is required');
  }

  if (isHexString(trimmed)) {
    return trimmed as `0x${string}`;
  }

  try {
    const decoded = atob(trimmed);
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i += 1) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return hexlify(bytes) as `0x${string}`;
  } catch (error) {
    // Not base64, treat as utf-8
    return hexlify(toUtf8Bytes(trimmed)) as `0x${string}`;
  }
}

export function MessageCreateForm() {
  const { address } = useAccount();
  const signerPromise = useEthersSigner();
  const { instance, isLoading: encryptionLoading, error: encryptionError } = useZamaInstance();

  const [title, setTitle] = useState('');
  const [encryptedBody, setEncryptedBody] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [decryptorAddress, setDecryptorAddress] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const unlockHint = useMemo(() => {
    if (!unlockDate) return '';
    const timestamp = Math.floor(new Date(unlockDate).getTime() / 1000);
    if (Number.isNaN(timestamp)) return '';
    return `Unix timestamp: ${timestamp}`;
  }, [unlockDate]);

  const handleGenerateAddress = () => {
    const wallet = Wallet.createRandom();
    setDecryptorAddress(wallet.address);
    setGeneratedKey(wallet.privateKey);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!address) {
      setFormError('Connect a wallet to continue.');
      return;
    }

    if (!instance) {
      setFormError('Encryption service is not ready yet.');
      return;
    }

    const signer = await signerPromise;
    if (!signer) {
      setFormError('Unable to access signer interface.');
      return;
    }

    if (!title.trim()) {
      setFormError('Title is required.');
      return;
    }

    let normalizedRecipient: string;
    try {
      normalizedRecipient = getAddress(decryptorAddress);
    } catch (error) {
      setFormError('Provide a valid EVM address for the decryptor.');
      return;
    }

    const unlockTimestamp = Math.floor(new Date(unlockDate).getTime() / 1000);
    if (!unlockDate || Number.isNaN(unlockTimestamp)) {
      setFormError('Select a valid unlock date and time.');
      return;
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (unlockTimestamp <= currentTimestamp) {
      setFormError('Unlock time must be in the future.');
      return;
    }

    let payload: `0x${string}`;
    try {
      payload = decodePayload(encryptedBody);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Invalid encrypted payload');
      return;
    }

    try {
      setStatus('encrypting');
      const buffer = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      buffer.addAddress(normalizedRecipient);
      const encryptedInput = await buffer.encrypt();

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setStatus('waiting');
      const tx = await contract.createMessage(
        title.trim(),
        payload,
        encryptedInput.handles[0],
        encryptedInput.inputProof,
        BigInt(unlockTimestamp),
      );
      const receipt = await tx.wait();

      setTxHash(receipt?.hash ?? tx.hash);
      setStatus('success');
      setTitle('');
      setEncryptedBody('');
      setUnlockDate('');
    } catch (error) {
      console.error('Failed to create message', error);
      setStatus('idle');
      setFormError(error instanceof Error ? error.message : 'Transaction failed');
    }
  };

  return (
    <section className="create-card">
      <h2 className="section-title">Schedule Encrypted Message</h2>
      <p className="section-subtitle">
        Store your ciphertext with a timelock. The decryptor address receives access only after the unlock time passes.
      </p>

      {encryptionError && <div className="alert alert-error">{encryptionError}</div>}
      {formError && <div className="alert alert-error">{formError}</div>}
      {status === 'success' && txHash && (
        <div className="alert alert-success">
          Message stored successfully. Transaction hash: <span className="mono">{txHash}</span>
        </div>
      )}

      <form className="create-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Title
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="Confidential update"
            required
          />
        </label>

        <label className="form-label">
          Encrypted Message
          <textarea
            className="form-textarea"
            value={encryptedBody}
            onChange={event => setEncryptedBody(event.target.value)}
            placeholder="Paste ciphertext, hex or base64"
            rows={6}
            required
          />
        </label>

        <label className="form-label">
          Unlock Date
          <input
            type="datetime-local"
            className="form-input"
            value={unlockDate}
            onChange={event => setUnlockDate(event.target.value)}
            required
          />
        </label>
        {unlockHint && <div className="hint">{unlockHint}</div>}

        <label className="form-label">
          Decryptor Address
          <div className="address-row">
            <input
              type="text"
              className="form-input"
              value={decryptorAddress}
              onChange={event => setDecryptorAddress(event.target.value)}
              placeholder="0x..."
              required
            />
            <button type="button" className="secondary-button" onClick={handleGenerateAddress}>
              Generate
            </button>
          </div>
        </label>
        {generatedKey && (
          <div className="generated-key">
            <p className="hint">Store this private key securely. It will not be shown again.</p>
            <code className="mono">{generatedKey}</code>
          </div>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={encryptionLoading || status === 'encrypting' || status === 'waiting'}
        >
          {status === 'encrypting' && 'Encrypting recipient...'}
          {status === 'waiting' && 'Waiting for confirmation...'}
          {status === 'idle' || status === 'success' ? 'Save Message' : null}
        </button>
      </form>
    </section>
  );
}
