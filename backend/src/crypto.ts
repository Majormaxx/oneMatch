import * as ed25519 from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';
import { bcs } from '@mysten/bcs';

// Set the hash function for ed25519
ed25519.etc.sha512Sync = (...m) => sha512(ed25519.etc.concatBytes(...m));

/**
 * Ed25519 Cryptographic Utilities
 * Handles key generation, signing, and verification for smart contract proofs
 */

export class CryptoService {
  private privateKey: Uint8Array | null = null;
  private publicKey: Uint8Array | null = null;

  constructor() {
    // BCS is globally available via import
  }

  /**
   * Initialize with existing private key (from environment)
   */
  async initialize(privateKeyHex: string) {
    try {
      this.privateKey = hexToBytes(privateKeyHex);
      this.publicKey = await ed25519.getPublicKeyAsync(this.privateKey);
      console.log('✓ Crypto service initialized with existing keys');
    } catch (error) {
      throw new Error(`Failed to initialize crypto service: ${error}`);
    }
  }

  /**
   * Generate new Ed25519 key pair
   */
  async generateKeyPair(): Promise<{ privateKey: string; publicKey: string }> {
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = await ed25519.getPublicKeyAsync(privateKey);

    return {
      privateKey: bytesToHex(privateKey),
      publicKey: bytesToHex(publicKey),
    };
  }

  /**
   * Get public key as hex string
   */
  getPublicKey(): string {
    if (!this.publicKey) throw new Error('Crypto service not initialized');
    return bytesToHex(this.publicKey);
  }

  /**
   * Get public key as byte array (for Move contract format)
   */
  getPublicKeyBytes(): number[] {
    if (!this.publicKey) throw new Error('Crypto service not initialized');
    return Array.from(this.publicKey);
  }

  /**
   * Sign a message and return signature
   */
  async signMessage(message: Uint8Array): Promise<string> {
    if (!this.privateKey) throw new Error('Crypto service not initialized');
    const signature = await ed25519.signAsync(message, this.privateKey);
    return bytesToHex(signature);
  }

  /**
   * Generate proof for Game Result (onematch::core::submit_game_result)
   * Message format: address + u64 (score) + u8 (difficulty) + u8 (won)
   */
  async generateGameProof(params: {
    playerAddress: string;
    score: number;
    difficulty: number;
    won: boolean;
  }): Promise<string> {
    // Serialize data exactly as Move expects
    // vector<u8> message = bcs::to_bytes(player);
    // vector::append(&mut message, bcs::to_bytes(&score));
    // vector::push_back(&mut message, difficulty);
    // vector::push_back(&mut message, if (won) { 1 } else { 0 });

    // Address is 32 bytes
    const playerBytes = bcs.bytes(32).serialize(hexToBytes(params.playerAddress)).toBytes();
    const scoreBytes = bcs.u64().serialize(params.score).toBytes();
    
    const message = new Uint8Array(playerBytes.length + scoreBytes.length + 2);
    message.set(playerBytes, 0);
    message.set(scoreBytes, playerBytes.length);
    message[playerBytes.length + scoreBytes.length] = params.difficulty;
    message[playerBytes.length + scoreBytes.length + 1] = params.won ? 1 : 0;

    return this.signMessage(message);
  }

  /**
   * Generate proof for Leaderboard (onematch::leaderboard::submit_score)
   * Message format: address + u64 (score) + u8 (difficulty)
   */
  async generateScoreProof(params: {
    playerAddress: string;
    score: number;
    difficulty: number;
  }): Promise<string> {
    // Serialize data exactly as Move expects
    // vector<u8> message = bcs::to_bytes(player);
    // vector::append(&mut message, bcs::to_bytes(&score));
    // vector::push_back(&mut message, difficulty);

    const playerBytes = bcs.bytes(32).serialize(hexToBytes(params.playerAddress)).toBytes();
    const scoreBytes = bcs.u64().serialize(params.score).toBytes();
    
    const message = new Uint8Array(playerBytes.length + scoreBytes.length + 1);
    message.set(playerBytes, 0);
    message.set(scoreBytes, playerBytes.length);
    message[playerBytes.length + scoreBytes.length] = params.difficulty;

    return this.signMessage(message);
  }

  /**
   * Generate authentication proof
   */
  async generateAuthProof(walletAddress: string): Promise<{
    message: string;
    signature: string;
  }> {
    const timestamp = Date.now();
    const messageStr = `OneMatch Authentication\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
    const messageBytes = new TextEncoder().encode(messageStr);
    const signature = await this.signMessage(messageBytes);

    return { message: messageStr, signature };
  }

  /**
   * Generate proof for NFT minting (Legacy/Placeholder)
   */
  async generateNFTProof(params: {
    walletAddress: string;
    achievementType: string;
    timestamp: number;
  }): Promise<{
    message: string;
    signature: string;
    publicKey: string;
  }> {
    const messageStr = `${params.walletAddress}:${params.achievementType}:${params.timestamp}`;
    const messageBytes = new TextEncoder().encode(messageStr);
    const signature = await this.signMessage(messageBytes);

    return {
      message: messageStr,
      signature,
      publicKey: this.getPublicKey(),
    };
  }
}

// Utility functions
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const cleaned = hex.replace(/^0x/, '');
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Export singleton instance
export const cryptoService = new CryptoService();
