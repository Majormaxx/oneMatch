'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

export function WalletConnect() {
  const account = useCurrentAccount();

  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <div className="font-semibold">Connected</div>
            <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </div>
          </div>
          <ConnectButton />
        </div>
      ) : (
        <div className="space-y-2">
          <ConnectButton className="btn-primary" />
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Please use OneWallet
          </p>
        </div>
      )}
    </div>
  );
}
