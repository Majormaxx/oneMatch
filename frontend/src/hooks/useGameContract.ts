import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/bcs';
import { CONTRACT } from '@/lib/constants';

export function useGameContract() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const createProfile = async () => {
    if (!account) return;
    
    const tx = new Transaction();
    tx.moveCall({
      target: `${CONTRACT.PACKAGE_ID}::core::create_profile`,
      arguments: [],
    });

    return new Promise((resolve, reject) => {
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => resolve(result),
          onError: (error) => reject(error),
        }
      );
    });
  };

  const submitGameResult = async (
    profileId: string,
    score: number,
    difficulty: number,
    won: boolean,
    isPerfect: boolean
  ) => {
    if (!account) return;

    try {
      // 1. Get proof from backend
      const response = await fetch('http://localhost:3001/api/game/sign-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerAddress: account.address,
          score,
          difficulty,
          won
        })
      });

      if (!response.ok) throw new Error('Failed to get proof from backend');
      const { signature } = await response.json();
      
      // Convert hex signature to byte array
      const signatureBytes = new Uint8Array(signature.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));

      // 2. Submit transaction
      const tx = new Transaction();
      tx.moveCall({
        target: `${CONTRACT.PACKAGE_ID}::core::submit_game_result`,
        arguments: [
          tx.object(profileId),
          tx.object(CONTRACT.GAME_REGISTRY_ID),
          tx.pure.u64(score),
          tx.pure.u8(difficulty),
          tx.pure.bool(won),
          tx.pure.bool(isPerfect),
          tx.pure.vector('u8', Array.from(signatureBytes)),
        ],
      });

      await signAndExecute({
        transaction: tx,
      });
    } catch (error) {
      console.error('Error submitting game result:', error);
      throw error;
    }
  };

  const submitScoreToLeaderboard = async (
    score: number,
    difficulty: number
    // proof is now fetched internally
  ) => {
    if (!account) return;

    try {
      // 1. Get proof from backend
      const response = await fetch('http://localhost:3001/api/leaderboard/sign-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerAddress: account.address,
          score,
          difficulty
        })
      });

      if (!response.ok) throw new Error('Failed to get proof from backend');
      const { signature } = await response.json();
      
      const signatureBytes = new Uint8Array(signature.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));

      const tx = new Transaction();
      tx.moveCall({
        target: `${CONTRACT.PACKAGE_ID}::leaderboard::submit_score`,
        arguments: [
          tx.object(CONTRACT.DAILY_LEADERBOARD_ID),
          tx.object(CONTRACT.ALL_TIME_LEADERBOARD_ID),
          tx.pure.u64(score),
          tx.pure.u8(difficulty),
          tx.pure.vector('u8', Array.from(signatureBytes)),
        ],
      });

      await signAndExecute({
        transaction: tx,
      });
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  };

  const getProfile = async () => {
    if (!account) return null;

    const { data } = await client.getOwnedObjects({
      owner: account.address,
      filter: {
        StructType: `${CONTRACT.PACKAGE_ID}::core::PlayerProfile`,
      },
      options: {
        showContent: true,
      },
    });

    if (data && data.length > 0) {
      return data[0].data;
    }
    return null;
  };

  const getDailyLeaderboard = async (limit: number = 10) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${CONTRACT.PACKAGE_ID}::leaderboard::get_daily_rankings`,
      arguments: [
        tx.object(CONTRACT.DAILY_LEADERBOARD_ID),
        tx.pure.u64(limit),
      ],
    });

    const result = await client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: account?.address || '0x0000000000000000000000000000000000000000000000000000000000000000',
    });

    if (result.results?.[0]?.returnValues?.[0]) {
      const value = result.results[0].returnValues[0];
      const bytes = Uint8Array.from(value[0]);
      
      // Define BCS struct for LeaderboardEntry using fluent API
      const LeaderboardEntry = bcs.struct('LeaderboardEntry', {
        player: bcs.bytes(32).transform({
          input: (val: string) => Uint8Array.from(Buffer.from(val.slice(2), 'hex')),
          output: (val) => `0x${Buffer.from(val).toString('hex')}`,
        }),
        score: bcs.u64(),
        difficulty: bcs.u8(),
        timestamp: bcs.u64(),
      });

      // Define vector<LeaderboardEntry>
      const Leaderboard = bcs.vector(LeaderboardEntry);

      // Decode the bytes
      const decoded = Leaderboard.parse(bytes);
      
      // Map to friendly format
      return decoded.map((entry: any) => ({
        player: entry.player,
        score: Number(entry.score),
        difficulty: Number(entry.difficulty),
        timestamp: Number(entry.timestamp),
      }));
    }
    return [];
  };

  return {
    createProfile,
    getProfile,
    submitGameResult,
    submitScoreToLeaderboard,
    getDailyLeaderboard,
  };
}
