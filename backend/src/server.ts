import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { cryptoService } from './crypto';
import { validateAchievement, getUnlockedAchievements, type GameResult, type AchievementType } from './achievements';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    publicKey: cryptoService.getPublicKey(),
  });
});

/**
 * Verify wallet authentication
 * POST /api/auth/verify
 * Body: { walletAddress: string, signature: string, message: string }
 */
app.post('/api/auth/verify', async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        error: 'Missing required fields: walletAddress, signature, message',
      });
    }

    // In production, you'd verify the wallet signature here
    // For now, we'll generate an auth token
    const authProof = await cryptoService.generateAuthProof(walletAddress);

    res.json({
      success: true,
      authToken: authProof.signature,
      message: 'Authentication successful',
      expiresIn: 86400, // 24 hours
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Generate NFT minting proof
 * POST /api/nft/proof
 * Body: { walletAddress: string, achievementType: string, gameResult: GameResult }
 */
app.post('/api/nft/proof', async (req: Request, res: Response) => {
  try {
    const { walletAddress, achievementType, gameResult } = req.body;

    if (!walletAddress || !achievementType) {
      return res.status(400).json({
        error: 'Missing required fields: walletAddress, achievementType',
      });
    }

    // Validate achievement eligibility
    const isEligible = validateAchievement(achievementType as AchievementType, gameResult);

    if (!isEligible) {
      return res.status(403).json({
        error: 'Not eligible for this achievement',
        achievementType,
        criteria: 'Achievement requirements not met',
      });
    }

    // Generate proof
    const timestamp = Date.now();
    const proof = await cryptoService.generateNFTProof({
      walletAddress,
      achievementType,
      timestamp,
    });

    res.json({
      success: true,
      proof: {
        message: proof.message,
        signature: proof.signature,
        publicKey: proof.publicKey,
        timestamp,
      },
      achievementType,
    });
  } catch (error) {
    console.error('NFT proof generation error:', error);
    res.status(500).json({
      error: 'Failed to generate NFT proof',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Sign game result for smart contract submission
 * POST /api/game/sign-result
 */
app.post('/api/game/sign-result', async (req: Request, res: Response) => {
  try {
    const { playerAddress, score, difficulty, won } = req.body;

    if (!playerAddress || score === undefined || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Validate score against difficulty/time (anti-cheat)

    const signature = await cryptoService.generateGameProof({
      playerAddress,
      score,
      difficulty,
      won: !!won,
    });

    // Convert signature to bytes array for Move
    // const signatureBytes = Array.from(hexToBytes(signature));

    res.json({
      success: true,
      signature,
      // signatureBytes
    });
  } catch (error) {
    console.error('Game signing error:', error);
    res.status(500).json({ error: 'Failed to sign game result' });
  }
});

/**
 * Sign leaderboard score
 * POST /api/leaderboard/sign-score
 */
app.post('/api/leaderboard/sign-score', async (req: Request, res: Response) => {
  try {
    const { playerAddress, score, difficulty } = req.body;

    if (!playerAddress || score === undefined || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const signature = await cryptoService.generateScoreProof({
      playerAddress,
      score,
      difficulty,
    });

    res.json({
      success: true,
      signature,
    });
  } catch (error) {
    console.error('Leaderboard signing error:', error);
    res.status(500).json({ error: 'Failed to sign score' });
  }
});

/**
 * Get all unlocked achievements for a game result
 * POST /api/achievements/check
 * Body: { gameResult: GameResult }
 */
app.post('/api/achievements/check', async (req: Request, res: Response) => {
  try {
    const { gameResult } = req.body;

    if (!gameResult) {
      return res.status(400).json({
        error: 'Missing gameResult in request body',
      });
    }

    const unlocked = getUnlockedAchievements(gameResult as GameResult);

    res.json({
      success: true,
      achievements: unlocked.map(a => ({
        type: a.type,
        name: a.name,
        rarity: a.rarity,
        description: a.description,
      })),
      count: unlocked.length,
    });
  } catch (error) {
    console.error('Achievement check error:', error);
    res.status(500).json({
      error: 'Failed to check achievements',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get public key for smart contracts
 * GET /api/public-key
 */
app.get('/api/public-key', (req: Request, res: Response) => {
  try {
    const publicKey = cryptoService.getPublicKey();
    const publicKeyBytes = cryptoService.getPublicKeyBytes();

    res.json({
      publicKeyHex: publicKey,
      publicKeyBytes,
      moveFormat: `vector[${publicKeyBytes.join(', ')}]`,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve public key',
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

/**
 * Initialize server
 */
async function startServer() {
  try {
    // Initialize crypto service with private key from environment
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey || privateKey === 'YOUR_PRIVATE_KEY_HERE') {
      console.error('❌ PRIVATE_KEY not set in environment variables');
      console.log('\nTo generate keys, run:');
      console.log('  npm run generate-keys\n');
      process.exit(1);
    }

    await cryptoService.initialize(privateKey);

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n✓ OneMatch Backend Server running on port ${PORT}`);
      console.log(`✓ Public Key: ${cryptoService.getPublicKey()}`);
      console.log(`✓ CORS enabled for: ${ALLOWED_ORIGINS.join(', ')}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
