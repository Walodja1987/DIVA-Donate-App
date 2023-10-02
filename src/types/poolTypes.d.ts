export type Pool = {
    floor: string;
    inflection: string;
    cap: string;
    gradient: string;
    collateralBalance: string;
    finalReferenceValue: string;
    capacity: string;
    statusTimestamp: string;
    shortToken: string;
    payoutShort: string;
    longToken: string;
    payoutLong: string;
    collateralToken: string;
    expiryTime: string;
    dataProvider: string;
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
