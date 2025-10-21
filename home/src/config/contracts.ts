export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`;

export const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'title',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'encryptedContent',
        type: 'bytes',
      },
      {
        internalType: 'externalEaddress',
        name: 'encryptedRecipient',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'inputProof',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'unlockTimestamp',
        type: 'uint256',
      },
    ],
    name: 'createMessage',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'messageId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'allowRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
    ],
    name: 'getMessageIdsByCreator',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'messageId',
        type: 'uint256',
      },
    ],
    name: 'getMessage',
    outputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'title',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'encryptedContent',
        type: 'bytes',
      },
      {
        internalType: 'eaddress',
        name: 'encryptedRecipient',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'createdAt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'unlockTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'accessGranted',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'grantedRecipient',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'messageId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'DecryptionAllowed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'messageId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'unlockTimestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'createdAt',
        type: 'uint256',
      },
    ],
    name: 'MessageCreated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'protocolId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
] as const;
