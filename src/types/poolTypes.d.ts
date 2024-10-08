export type Pool = {
    floor: string;
    inflection: string;
    cap: string;
    gradient: string;
    collateralBalance: string;
    finalReferenceValue: string;
    capacity: string;
    statusTimestamp: string;
    shortToken: `0x${string}`;
    payoutShort: string;
    longToken: `0x${string}`;
    payoutLong: string;
    collateralToken: `0x${string}`;
    expiryTime: string;
    dataProvider: `0x${string}`;
    indexFees: string;
    indexSettlementPeriods: string;
    statusFinalReferenceValue: string;
    referenceAsset: string;
};

export type PoolExtended = {
    poolParams: Pool;
    beneficiarySide: string;
};

// Possible values of `statusFinalReferenceValue` returned by DIVA Protocol:
// - 0: Open
// - 1: Submitted
// - 2: Challenged
// - 3: Confirmed
export type Status = 0 | 1 | 2 | 3;

export type StatusSubgraph = "Open" | "Submitted" | "Challenged" | "Confirmed";
