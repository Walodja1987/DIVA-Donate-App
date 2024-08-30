export interface Pool {
    id: `0x${string}`;
    statusFinalReferenceValue: string;
    payoutLong: string;
    payoutShort: string;
    capacity: string;
    collateralBalanceGross: string;
  }

export interface LiquidityEvent {
    pool: Pool;
    eventType: 'Added' | 'Issued' | 'Removed';
    collateralAmount: string;
    id: string;
    longTokenHolder: `0x${string}`;
    shortTokenHolder: `0x${string}`;
    msgSender: `0x${string}`;
    timestamp: string;
  };
  
  export interface DIVALiquidityResponse {
    liquidities: LiquidityEvent[];
  };