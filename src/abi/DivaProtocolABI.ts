export const DivaABI = [
  { "inputs": [], "name": "AmountExceedsClaimableFee", "type": "error" },
  { "inputs": [], "name": "RecipientIsZeroAddress", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "collateralToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FeeClaimTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "collateralToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FeeClaimed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          { "internalType": "address", "name": "recipient", "type": "address" }
        ],
        "internalType": "struct IClaim.ArgsBatchClaimFee[]",
        "name": "_argsBatchClaimFee",
        "type": "tuple[]"
      }
    ],
    "name": "batchClaimFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "recipient", "type": "address" },
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "internalType": "struct IClaim.ArgsBatchTransferFeeClaim[]",
        "name": "_argsBatchTransferFeeClaim",
        "type": "tuple[]"
      }
    ],
    "name": "batchTransferFeeClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_collateralToken",
        "type": "address"
      },
      { "internalType": "address", "name": "_recipient", "type": "address" }
    ],
    "name": "claimFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_recipient", "type": "address" },
      {
        "internalType": "address",
        "name": "_collateralToken",
        "type": "address"
      },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "transferFeeClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes4", "name": "_selector", "type": "bytes4" }
    ],
    "name": "CannotAddFunctionToDiamondThatAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "bytes4[]", "name": "_selectors", "type": "bytes4[]" }
    ],
    "name": "CannotAddSelectorsToZeroAddress",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "bytes4", "name": "_selector", "type": "bytes4" }
    ],
    "name": "CannotRemoveFunctionThatDoesNotExist",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "bytes4", "name": "_selector", "type": "bytes4" }
    ],
    "name": "CannotRemoveImmutableFunction",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "bytes4", "name": "_selector", "type": "bytes4" }
    ],
    "name": "CannotReplaceFunctionWithTheSameFunctionFromTheSameFacet",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "bytes4[]", "name": "_selectors", "type": "bytes4[]" }
    ],
    "name": "CannotReplaceFunctionsFromFacetWithZeroAddress",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "uint8", "name": "_action", "type": "uint8" }],
    "name": "IncorrectFacetCutAction",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_initializationContractAddress",
        "type": "address"
      },
      { "internalType": "bytes", "name": "_calldata", "type": "bytes" }
    ],
    "name": "InitializationFunctionReverted",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_contractAddress",
        "type": "address"
      },
      { "internalType": "string", "name": "_message", "type": "string" }
    ],
    "name": "NoBytecodeAtAddress",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_facetAddress", "type": "address" }
    ],
    "name": "NoSelectorsProvidedForFacetForCut",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "address", "name": "_contractOwner", "type": "address" }
    ],
    "name": "NotContractOwner",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_facetAddress", "type": "address" }
    ],
    "name": "RemoveFacetAddressMustBeZeroAddress",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "enum IDiamondCut.FacetCutAction",
            "name": "action",
            "type": "uint8"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "indexed": false,
        "internalType": "struct IDiamondCut.FacetCut[]",
        "name": "_facetCut",
        "type": "tuple[]"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_init",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "_calldata",
        "type": "bytes"
      }
    ],
    "name": "DiamondCut",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "enum IDiamondCut.FacetCutAction",
            "name": "action",
            "type": "uint8"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "internalType": "struct IDiamondCut.FacetCut[]",
        "name": "_facetCut",
        "type": "tuple[]"
      },
      { "internalType": "address", "name": "_init", "type": "address" },
      { "internalType": "bytes", "name": "_calldata", "type": "bytes" }
    ],
    "name": "diamondCut",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "_functionSelector",
        "type": "bytes4"
      }
    ],
    "name": "facetAddress",
    "outputs": [
      { "internalType": "address", "name": "facetAddress_", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facetAddresses",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "facetAddresses_",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_facet", "type": "address" }
    ],
    "name": "facetFunctionSelectors",
    "outputs": [
      {
        "internalType": "bytes4[]",
        "name": "facetFunctionSelectors_",
        "type": "bytes4[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          },
          {
            "internalType": "bytes4[]",
            "name": "functionSelectors",
            "type": "bytes4[]"
          }
        ],
        "internalType": "struct IDiamondLoupe.Facet[]",
        "name": "facets_",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes4", "name": "_interfaceId", "type": "bytes4" }
    ],
    "name": "supportsInterface",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  { "inputs": [], "name": "FeeTokensNotSupported", "type": "error" },
  { "inputs": [], "name": "InvalidSignature", "type": "error" },
  { "inputs": [], "name": "NonExistentPool", "type": "error" },
  {
    "inputs": [],
    "name": "OfferInvalidCancelledFilledOrExpired",
    "type": "error"
  },
  { "inputs": [], "name": "PoolCapacityExceeded", "type": "error" },
  { "inputs": [], "name": "PoolExpired", "type": "error" },
  {
    "inputs": [],
    "name": "TakerFillAmountExceedsFillableAmount",
    "type": "error"
  },
  { "inputs": [], "name": "TakerFillAmountSmallerMinimum", "type": "error" },
  { "inputs": [], "name": "UnauthorizedTaker", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "typedOfferHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "maker",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "taker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "takerFilledAmount",
        "type": "uint256"
      }
    ],
    "name": "OfferFilled",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              { "internalType": "address", "name": "maker", "type": "address" },
              { "internalType": "address", "name": "taker", "type": "address" },
              {
                "internalType": "uint256",
                "name": "makerCollateralAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "takerCollateralAmount",
                "type": "uint256"
              },
              { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
              {
                "internalType": "uint256",
                "name": "offerExpiry",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "minimumTakerFillAmount",
                "type": "uint256"
              },
              {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
              },
              { "internalType": "uint256", "name": "salt", "type": "uint256" }
            ],
            "internalType": "struct LibEIP712.OfferAddLiquidity",
            "name": "offerAddLiquidity",
            "type": "tuple"
          },
          {
            "components": [
              { "internalType": "uint8", "name": "v", "type": "uint8" },
              { "internalType": "bytes32", "name": "r", "type": "bytes32" },
              { "internalType": "bytes32", "name": "s", "type": "bytes32" }
            ],
            "internalType": "struct LibEIP712.Signature",
            "name": "signature",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "takerFillAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IEIP712Add.ArgsBatchFillOfferAddLiquidity[]",
        "name": "_argsBatchOfferAddLiquidity",
        "type": "tuple[]"
      }
    ],
    "name": "batchFillOfferAddLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferAddLiquidity",
        "name": "_offerAddLiquidity",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "internalType": "struct LibEIP712.Signature",
        "name": "_signature",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "_takerFillAmount",
        "type": "uint256"
      }
    ],
    "name": "fillOfferAddLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "MsgSenderNotMaker", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "typedOfferHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "maker",
        "type": "address"
      }
    ],
    "name": "OfferCancelled",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferAddLiquidity[]",
        "name": "_offersAddLiquidity",
        "type": "tuple[]"
      }
    ],
    "name": "batchCancelOfferAddLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "referenceAsset",
            "type": "string"
          },
          { "internalType": "uint96", "name": "expiryTime", "type": "uint96" },
          { "internalType": "uint256", "name": "floor", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "inflection",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "cap", "type": "uint256" },
          { "internalType": "uint256", "name": "gradient", "type": "uint256" },
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "dataProvider",
            "type": "address"
          },
          { "internalType": "uint256", "name": "capacity", "type": "uint256" },
          {
            "internalType": "address",
            "name": "permissionedERC721Token",
            "type": "address"
          },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferCreateContingentPool[]",
        "name": "_offersCreateContingentPool",
        "type": "tuple[]"
      }
    ],
    "name": "batchCancelOfferCreateContingentPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "positionTokenAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferRemoveLiquidity[]",
        "name": "_offersRemoveLiquidity",
        "type": "tuple[]"
      }
    ],
    "name": "batchCancelOfferRemoveLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferAddLiquidity",
        "name": "_offerAddLiquidity",
        "type": "tuple"
      }
    ],
    "name": "cancelOfferAddLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "referenceAsset",
            "type": "string"
          },
          { "internalType": "uint96", "name": "expiryTime", "type": "uint96" },
          { "internalType": "uint256", "name": "floor", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "inflection",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "cap", "type": "uint256" },
          { "internalType": "uint256", "name": "gradient", "type": "uint256" },
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "dataProvider",
            "type": "address"
          },
          { "internalType": "uint256", "name": "capacity", "type": "uint256" },
          {
            "internalType": "address",
            "name": "permissionedERC721Token",
            "type": "address"
          },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferCreateContingentPool",
        "name": "_offerCreateContingentPool",
        "type": "tuple"
      }
    ],
    "name": "cancelOfferCreateContingentPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "positionTokenAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferRemoveLiquidity",
        "name": "_offerRemoveLiquidity",
        "type": "tuple"
      }
    ],
    "name": "cancelOfferRemoveLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "InvalidInputParamsCreateContingentPool",
    "type": "error"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              { "internalType": "address", "name": "maker", "type": "address" },
              { "internalType": "address", "name": "taker", "type": "address" },
              {
                "internalType": "uint256",
                "name": "makerCollateralAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "takerCollateralAmount",
                "type": "uint256"
              },
              { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
              {
                "internalType": "uint256",
                "name": "offerExpiry",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "minimumTakerFillAmount",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "referenceAsset",
                "type": "string"
              },
              {
                "internalType": "uint96",
                "name": "expiryTime",
                "type": "uint96"
              },
              { "internalType": "uint256", "name": "floor", "type": "uint256" },
              {
                "internalType": "uint256",
                "name": "inflection",
                "type": "uint256"
              },
              { "internalType": "uint256", "name": "cap", "type": "uint256" },
              {
                "internalType": "uint256",
                "name": "gradient",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "collateralToken",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "dataProvider",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "capacity",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "permissionedERC721Token",
                "type": "address"
              },
              { "internalType": "uint256", "name": "salt", "type": "uint256" }
            ],
            "internalType": "struct LibEIP712.OfferCreateContingentPool",
            "name": "offerCreateContingentPool",
            "type": "tuple"
          },
          {
            "components": [
              { "internalType": "uint8", "name": "v", "type": "uint8" },
              { "internalType": "bytes32", "name": "r", "type": "bytes32" },
              { "internalType": "bytes32", "name": "s", "type": "bytes32" }
            ],
            "internalType": "struct LibEIP712.Signature",
            "name": "signature",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "takerFillAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IEIP712Create.ArgsBatchFillOfferCreateContingentPool[]",
        "name": "_argsBatchFillOfferCreateContingentPool",
        "type": "tuple[]"
      }
    ],
    "name": "batchFillOfferCreateContingentPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "referenceAsset",
            "type": "string"
          },
          { "internalType": "uint96", "name": "expiryTime", "type": "uint96" },
          { "internalType": "uint256", "name": "floor", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "inflection",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "cap", "type": "uint256" },
          { "internalType": "uint256", "name": "gradient", "type": "uint256" },
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "dataProvider",
            "type": "address"
          },
          { "internalType": "uint256", "name": "capacity", "type": "uint256" },
          {
            "internalType": "address",
            "name": "permissionedERC721Token",
            "type": "address"
          },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferCreateContingentPool",
        "name": "_offerCreateContingentPool",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "internalType": "struct LibEIP712.Signature",
        "name": "_signature",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "_takerFillAmount",
        "type": "uint256"
      }
    ],
    "name": "fillOfferCreateContingentPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "AmountExceedsPoolCollateralBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FeeAmountExceedsPoolCollateralBalance",
    "type": "error"
  },
  { "inputs": [], "name": "FinalValueAlreadyConfirmed", "type": "error" },
  { "inputs": [], "name": "InsufficientShortOrLongBalance", "type": "error" },
  { "inputs": [], "name": "ReturnCollateralPaused", "type": "error" },
  { "inputs": [], "name": "ZeroProtocolFee", "type": "error" },
  { "inputs": [], "name": "ZeroSettlementFee", "type": "error" },
  {
    "inputs": [
      {
        "components": [
          {
            "components": [
              { "internalType": "address", "name": "maker", "type": "address" },
              { "internalType": "address", "name": "taker", "type": "address" },
              {
                "internalType": "uint256",
                "name": "positionTokenAmount",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "makerCollateralAmount",
                "type": "uint256"
              },
              { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
              {
                "internalType": "uint256",
                "name": "offerExpiry",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "minimumTakerFillAmount",
                "type": "uint256"
              },
              {
                "internalType": "bytes32",
                "name": "poolId",
                "type": "bytes32"
              },
              { "internalType": "uint256", "name": "salt", "type": "uint256" }
            ],
            "internalType": "struct LibEIP712.OfferRemoveLiquidity",
            "name": "offerRemoveLiquidity",
            "type": "tuple"
          },
          {
            "components": [
              { "internalType": "uint8", "name": "v", "type": "uint8" },
              { "internalType": "bytes32", "name": "r", "type": "bytes32" },
              { "internalType": "bytes32", "name": "s", "type": "bytes32" }
            ],
            "internalType": "struct LibEIP712.Signature",
            "name": "signature",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "positionTokenFillAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IEIP712Remove.ArgsBatchFillOfferRemoveLiquidity[]",
        "name": "_argsBatchOfferRemoveLiquidity",
        "type": "tuple[]"
      }
    ],
    "name": "batchFillOfferRemoveLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "positionTokenAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferRemoveLiquidity",
        "name": "_offerRemoveLiquidity",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "internalType": "struct LibEIP712.Signature",
        "name": "_signature",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "_positionTokenFillAmount",
        "type": "uint256"
      }
    ],
    "name": "fillOfferRemoveLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getChainId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_collateralToken",
        "type": "address"
      },
      { "internalType": "address", "name": "_recipient", "type": "address" }
    ],
    "name": "getClaim",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFallbackDataProviderInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "previousFallbackDataProvider",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "fallbackDataProvider",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startTimeFallbackDataProvider",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint48", "name": "_indexFees", "type": "uint48" }
    ],
    "name": "getFees",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          { "internalType": "uint96", "name": "protocolFee", "type": "uint96" },
          {
            "internalType": "uint96",
            "name": "settlementFee",
            "type": "uint96"
          }
        ],
        "internalType": "struct LibDIVAStorage.Fees",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nbrLastUpdates",
        "type": "uint256"
      }
    ],
    "name": "getFeesHistory",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          { "internalType": "uint96", "name": "protocolFee", "type": "uint96" },
          {
            "internalType": "uint96",
            "name": "settlementFee",
            "type": "uint96"
          }
        ],
        "internalType": "struct LibDIVAStorage.Fees[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFeesHistoryLength",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGovernanceParameters",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          { "internalType": "uint96", "name": "protocolFee", "type": "uint96" },
          {
            "internalType": "uint96",
            "name": "settlementFee",
            "type": "uint96"
          }
        ],
        "internalType": "struct LibDIVAStorage.Fees",
        "name": "currentFees",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          {
            "internalType": "uint24",
            "name": "submissionPeriod",
            "type": "uint24"
          },
          {
            "internalType": "uint24",
            "name": "challengePeriod",
            "type": "uint24"
          },
          {
            "internalType": "uint24",
            "name": "reviewPeriod",
            "type": "uint24"
          },
          {
            "internalType": "uint24",
            "name": "fallbackSubmissionPeriod",
            "type": "uint24"
          }
        ],
        "internalType": "struct LibDIVAStorage.SettlementPeriods",
        "name": "currentSettlementPeriods",
        "type": "tuple"
      },
      { "internalType": "address", "name": "treasury", "type": "address" },
      {
        "internalType": "address",
        "name": "fallbackDataProvider",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pauseReturnCollateralUntil",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferAddLiquidity",
        "name": "_offerAddLiquidity",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "internalType": "struct LibEIP712.Signature",
        "name": "_signature",
        "type": "tuple"
      }
    ],
    "name": "getOfferRelevantStateAddLiquidity",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "typedOfferHash",
            "type": "bytes32"
          },
          {
            "internalType": "enum LibEIP712.OfferStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "takerFilledAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct LibEIP712.OfferInfo",
        "name": "offerInfo",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "actualTakerFillableAmount",
        "type": "uint256"
      },
      { "internalType": "bool", "name": "isSignatureValid", "type": "bool" },
      { "internalType": "bool", "name": "poolExists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "takerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "referenceAsset",
            "type": "string"
          },
          { "internalType": "uint96", "name": "expiryTime", "type": "uint96" },
          { "internalType": "uint256", "name": "floor", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "inflection",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "cap", "type": "uint256" },
          { "internalType": "uint256", "name": "gradient", "type": "uint256" },
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "dataProvider",
            "type": "address"
          },
          { "internalType": "uint256", "name": "capacity", "type": "uint256" },
          {
            "internalType": "address",
            "name": "permissionedERC721Token",
            "type": "address"
          },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferCreateContingentPool",
        "name": "_offerCreateContingentPool",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "internalType": "struct LibEIP712.Signature",
        "name": "_signature",
        "type": "tuple"
      }
    ],
    "name": "getOfferRelevantStateCreateContingentPool",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "typedOfferHash",
            "type": "bytes32"
          },
          {
            "internalType": "enum LibEIP712.OfferStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "takerFilledAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct LibEIP712.OfferInfo",
        "name": "offerInfo",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "actualTakerFillableAmount",
        "type": "uint256"
      },
      { "internalType": "bool", "name": "isSignatureValid", "type": "bool" },
      {
        "internalType": "bool",
        "name": "isValidInputParamsCreateContingentPool",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "maker", "type": "address" },
          { "internalType": "address", "name": "taker", "type": "address" },
          {
            "internalType": "uint256",
            "name": "positionTokenAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "makerCollateralAmount",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "makerIsLong", "type": "bool" },
          {
            "internalType": "uint256",
            "name": "offerExpiry",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minimumTakerFillAmount",
            "type": "uint256"
          },
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "salt", "type": "uint256" }
        ],
        "internalType": "struct LibEIP712.OfferRemoveLiquidity",
        "name": "_offerRemoveLiquidity",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "uint8", "name": "v", "type": "uint8" },
          { "internalType": "bytes32", "name": "r", "type": "bytes32" },
          { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "internalType": "struct LibEIP712.Signature",
        "name": "_signature",
        "type": "tuple"
      }
    ],
    "name": "getOfferRelevantStateRemoveLiquidity",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "typedOfferHash",
            "type": "bytes32"
          },
          {
            "internalType": "enum LibEIP712.OfferStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "takerFilledAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct LibEIP712.OfferInfo",
        "name": "offerInfo",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "actualTakerFillableAmount",
        "type": "uint256"
      },
      { "internalType": "bool", "name": "isSignatureValid", "type": "bool" },
      { "internalType": "bool", "name": "poolExists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwner",
    "outputs": [
      { "internalType": "address", "name": "owner_", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwnershipContract",
    "outputs": [
      {
        "internalType": "address",
        "name": "ownershipContract_",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_typedOfferHash",
        "type": "bytes32"
      }
    ],
    "name": "getPoolIdByTypedCreateOfferHash",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_poolId", "type": "bytes32" }
    ],
    "name": "getPoolParameters",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "floor", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "inflection",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "cap", "type": "uint256" },
          { "internalType": "uint256", "name": "gradient", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "collateralBalance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "finalReferenceValue",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "capacity", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "statusTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "shortToken",
            "type": "address"
          },
          { "internalType": "uint96", "name": "payoutShort", "type": "uint96" },
          { "internalType": "address", "name": "longToken", "type": "address" },
          { "internalType": "uint96", "name": "payoutLong", "type": "uint96" },
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          { "internalType": "uint96", "name": "expiryTime", "type": "uint96" },
          {
            "internalType": "address",
            "name": "dataProvider",
            "type": "address"
          },
          { "internalType": "uint48", "name": "indexFees", "type": "uint48" },
          {
            "internalType": "uint48",
            "name": "indexSettlementPeriods",
            "type": "uint48"
          },
          {
            "internalType": "enum LibDIVAStorage.Status",
            "name": "statusFinalReferenceValue",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "referenceAsset",
            "type": "string"
          }
        ],
        "internalType": "struct LibDIVAStorage.Pool",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_positionToken", "type": "address" }
    ],
    "name": "getPoolParametersByAddress",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "floor", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "inflection",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "cap", "type": "uint256" },
          { "internalType": "uint256", "name": "gradient", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "collateralBalance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "finalReferenceValue",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "capacity", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "statusTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "shortToken",
            "type": "address"
          },
          { "internalType": "uint96", "name": "payoutShort", "type": "uint96" },
          { "internalType": "address", "name": "longToken", "type": "address" },
          { "internalType": "uint96", "name": "payoutLong", "type": "uint96" },
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          { "internalType": "uint96", "name": "expiryTime", "type": "uint96" },
          {
            "internalType": "address",
            "name": "dataProvider",
            "type": "address"
          },
          { "internalType": "uint48", "name": "indexFees", "type": "uint48" },
          {
            "internalType": "uint48",
            "name": "indexSettlementPeriods",
            "type": "uint48"
          },
          {
            "internalType": "enum LibDIVAStorage.Status",
            "name": "statusFinalReferenceValue",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "referenceAsset",
            "type": "string"
          }
        ],
        "internalType": "struct LibDIVAStorage.Pool",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_poolId", "type": "bytes32" }
    ],
    "name": "getReservedClaim",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint48",
        "name": "_indexSettlementPeriods",
        "type": "uint48"
      }
    ],
    "name": "getSettlementPeriods",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          {
            "internalType": "uint24",
            "name": "submissionPeriod",
            "type": "uint24"
          },
          {
            "internalType": "uint24",
            "name": "challengePeriod",
            "type": "uint24"
          },
          {
            "internalType": "uint24",
            "name": "reviewPeriod",
            "type": "uint24"
          },
          {
            "internalType": "uint24",
            "name": "fallbackSubmissionPeriod",
            "type": "uint24"
          }
        ],
        "internalType": "struct LibDIVAStorage.SettlementPeriods",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_nbrLastUpdates",
        "type": "uint256"
      }
    ],
    "name": "getSettlementPeriodsHistory",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          {
            "internalType": "uint24",
            "name": "submissionPeriod",
            "type": "uint24"
          },
          {
            "internalType": "uint24",
            "name": "challengePeriod",
            "type": "uint24"
          },
          {
            "internalType": "uint24",
            "name": "reviewPeriod",
            "type": "uint24"
          },
          {
            "internalType": "uint24",
            "name": "fallbackSubmissionPeriod",
            "type": "uint24"
          }
        ],
        "internalType": "struct LibDIVAStorage.SettlementPeriods[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSettlementPeriodsHistoryLength",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_typedOfferHash",
        "type": "bytes32"
      }
    ],
    "name": "getTakerFilledAmount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTreasuryInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "previousTreasury",
        "type": "address"
      },
      { "internalType": "address", "name": "treasury", "type": "address" },
      {
        "internalType": "uint256",
        "name": "startTimeTreasury",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  { "inputs": [], "name": "AlreadyUnpaused", "type": "error" },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_timestampBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startTimeFallbackDataProvider",
        "type": "uint256"
      }
    ],
    "name": "FallbackProviderAlreadyActive",
    "type": "error"
  },
  { "inputs": [], "name": "FeeAboveMaximum", "type": "error" },
  { "inputs": [], "name": "FeeBelowMinimum", "type": "error" },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_timestampBlock",
        "type": "uint256"
      },
      { "internalType": "uint256", "name": "_startTimeFees", "type": "uint256" }
    ],
    "name": "FeesAlreadyActive",
    "type": "error"
  },
  { "inputs": [], "name": "OutOfBounds", "type": "error" },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_timestampBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startTimeFallbackDataProvider",
        "type": "uint256"
      }
    ],
    "name": "PendingFallbackDataProviderUpdate",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_timestampBlock",
        "type": "uint256"
      },
      { "internalType": "uint256", "name": "_startTimeFees", "type": "uint256" }
    ],
    "name": "PendingFeesUpdate",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_timestampBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startTimeSettlementPeriods",
        "type": "uint256"
      }
    ],
    "name": "PendingSettlementPeriodsUpdate",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_timestampBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startTimeTreasury",
        "type": "uint256"
      }
    ],
    "name": "PendingTreasuryUpdate",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_timestampBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startTimeSettlementPeriods",
        "type": "uint256"
      }
    ],
    "name": "SettlementPeriodsAlreadyActive",
    "type": "error"
  },
  { "inputs": [], "name": "TooEarlyToPauseAgain", "type": "error" },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_timestampBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startTimeTreasury",
        "type": "uint256"
      }
    ],
    "name": "TreasuryAlreadyActive",
    "type": "error"
  },
  { "inputs": [], "name": "ZeroAddress", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "fallbackDataProvider",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startTimeFallbackDataProvider",
        "type": "uint256"
      }
    ],
    "name": "FallbackDataProviderUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint96",
        "name": "fee",
        "type": "uint96"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum IGovernance.FeeType",
        "name": "feeType",
        "type": "uint8"
      }
    ],
    "name": "FeeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "revokedBy",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "revokedFallbackDataProvider",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "restoredFallbackDataProvider",
        "type": "address"
      }
    ],
    "name": "PendingFallbackDataProviderUpdateRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "revokedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint96",
        "name": "revokedFee",
        "type": "uint96"
      },
      {
        "indexed": false,
        "internalType": "uint96",
        "name": "restoredFee",
        "type": "uint96"
      },
      {
        "indexed": false,
        "internalType": "enum IGovernance.FeeType",
        "name": "feeType",
        "type": "uint8"
      }
    ],
    "name": "PendingFeeUpdateRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "revokedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint24",
        "name": "revokedPeriod",
        "type": "uint24"
      },
      {
        "indexed": false,
        "internalType": "uint24",
        "name": "restoredPeriod",
        "type": "uint24"
      },
      {
        "indexed": false,
        "internalType": "enum IGovernance.SettlementPeriodType",
        "name": "periodType",
        "type": "uint8"
      }
    ],
    "name": "PendingSettlementPeriodUpdateRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "revokedBy",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "revokedTreasury",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "restoredTreasury",
        "type": "address"
      }
    ],
    "name": "PendingTreasuryUpdateRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pausedUntil",
        "type": "uint256"
      }
    ],
    "name": "ReturnCollateralPaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ReturnCollateralUnpaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint24",
        "name": "period",
        "type": "uint24"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum IGovernance.SettlementPeriodType",
        "name": "periodType",
        "type": "uint8"
      }
    ],
    "name": "SettlementPeriodUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "treasury",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startTimeTreasury",
        "type": "uint256"
      }
    ],
    "name": "TreasuryUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "pauseReturnCollateral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "revokePendingFallbackDataProviderUpdate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "revokePendingFeesUpdate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "revokePendingSettlementPeriodsUpdate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "revokePendingTreasuryUpdate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpauseReturnCollateral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newFallbackDataProvider",
        "type": "address"
      }
    ],
    "name": "updateFallbackDataProvider",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint96", "name": "_protocolFee", "type": "uint96" },
      { "internalType": "uint96", "name": "_settlementFee", "type": "uint96" }
    ],
    "name": "updateFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint24",
        "name": "_submissionPeriod",
        "type": "uint24"
      },
      {
        "internalType": "uint24",
        "name": "_challengePeriod",
        "type": "uint24"
      },
      { "internalType": "uint24", "name": "_reviewPeriod", "type": "uint24" },
      {
        "internalType": "uint24",
        "name": "_fallbackSubmissionPeriod",
        "type": "uint24"
      }
    ],
    "name": "updateSettlementPeriods",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_newTreasury", "type": "address" }
    ],
    "name": "updateTreasury",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FeeClaimAllocated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FeeClaimReserved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "longRecipient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "shortRecipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "collateralAmount",
        "type": "uint256"
      }
    ],
    "name": "LiquidityAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "longTokenHolder",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "shortTokenHolder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "collateralAmount",
        "type": "uint256"
      }
    ],
    "name": "LiquidityRemoved",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_poolId", "type": "bytes32" },
      {
        "internalType": "uint256",
        "name": "_collateralAmountIncr",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_longRecipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_shortRecipient",
        "type": "address"
      }
    ],
    "name": "addLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          {
            "internalType": "uint256",
            "name": "collateralAmountIncr",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "longRecipient",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "shortRecipient",
            "type": "address"
          }
        ],
        "internalType": "struct ILiquidity.ArgsBatchAddLiquidity[]",
        "name": "_argsBatchAddLiquidity",
        "type": "tuple[]"
      }
    ],
    "name": "batchAddLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "internalType": "struct ILiquidity.ArgsBatchRemoveLiquidity[]",
        "name": "_argsBatchRemoveLiquidity",
        "type": "tuple[]"
      }
    ],
    "name": "batchRemoveLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_poolId", "type": "bytes32" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "removeLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "longRecipient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "shortRecipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "collateralAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "permissionedERC721Token",
        "type": "address"
      }
    ],
    "name": "PoolIssued",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "referenceAsset",
            "type": "string"
          },
          { "internalType": "uint96", "name": "expiryTime", "type": "uint96" },
          { "internalType": "uint256", "name": "floor", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "inflection",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "cap", "type": "uint256" },
          { "internalType": "uint256", "name": "gradient", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "collateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "dataProvider",
            "type": "address"
          },
          { "internalType": "uint256", "name": "capacity", "type": "uint256" },
          {
            "internalType": "address",
            "name": "longRecipient",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "shortRecipient",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "permissionedERC721Token",
            "type": "address"
          }
        ],
        "internalType": "struct LibDIVA.PoolParams[]",
        "name": "_poolsParams",
        "type": "tuple[]"
      }
    ],
    "name": "batchCreateContingentPool",
    "outputs": [
      { "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "referenceAsset",
            "type": "string"
          },
          { "internalType": "uint96", "name": "expiryTime", "type": "uint96" },
          { "internalType": "uint256", "name": "floor", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "inflection",
            "type": "uint256"
          },
          { "internalType": "uint256", "name": "cap", "type": "uint256" },
          { "internalType": "uint256", "name": "gradient", "type": "uint256" },
          {
            "internalType": "uint256",
            "name": "collateralAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "collateralToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "dataProvider",
            "type": "address"
          },
          { "internalType": "uint256", "name": "capacity", "type": "uint256" },
          {
            "internalType": "address",
            "name": "longRecipient",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "shortRecipient",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "permissionedERC721Token",
            "type": "address"
          }
        ],
        "internalType": "struct LibDIVA.PoolParams",
        "name": "_poolParams",
        "type": "tuple"
      }
    ],
    "name": "createContingentPool",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "AlreadySubmittedOrConfirmed", "type": "error" },
  { "inputs": [], "name": "ChallengePeriodExpired", "type": "error" },
  { "inputs": [], "name": "ChallengePeriodNotExpired", "type": "error" },
  { "inputs": [], "name": "FinalReferenceValueNotSet", "type": "error" },
  { "inputs": [], "name": "InvalidPositionToken", "type": "error" },
  { "inputs": [], "name": "NoPositionTokens", "type": "error" },
  { "inputs": [], "name": "NotDataProvider", "type": "error" },
  { "inputs": [], "name": "NotFallbackDataProvider", "type": "error" },
  { "inputs": [], "name": "NothingToChallenge", "type": "error" },
  { "inputs": [], "name": "PoolNotExpired", "type": "error" },
  { "inputs": [], "name": "ReviewPeriodExpired", "type": "error" },
  { "inputs": [], "name": "ReviewPeriodNotExpired", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "positionToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountPositionToken",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "collateralAmountReturned",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "returnedTo",
        "type": "address"
      }
    ],
    "name": "PositionTokenRedeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ReservedClaimAllocated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "enum LibDIVAStorage.Status",
        "name": "statusFinalReferenceValue",
        "type": "uint8"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "by",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "proposedFinalReferenceValue",
        "type": "uint256"
      }
    ],
    "name": "StatusChanged",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          {
            "internalType": "uint256",
            "name": "proposedFinalReferenceValue",
            "type": "uint256"
          }
        ],
        "internalType": "struct ISettlement.ArgsBatchChallengeFinalReferenceValue[]",
        "name": "_argsBatchChallengeFinalReferenceValue",
        "type": "tuple[]"
      }
    ],
    "name": "batchChallengeFinalReferenceValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "positionToken",
            "type": "address"
          },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "internalType": "struct ISettlement.ArgsBatchRedeemPositionToken[]",
        "name": "_argsBatchRedeemPositionToken",
        "type": "tuple[]"
      }
    ],
    "name": "batchRedeemPositionToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          {
            "internalType": "uint256",
            "name": "finalReferenceValue",
            "type": "uint256"
          },
          { "internalType": "bool", "name": "allowChallenge", "type": "bool" }
        ],
        "internalType": "struct ISettlement.ArgsBatchSetFinalReferenceValue[]",
        "name": "_argsBatchSetFinalReferenceValue",
        "type": "tuple[]"
      }
    ],
    "name": "batchSetFinalReferenceValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_poolId", "type": "bytes32" },
      {
        "internalType": "uint256",
        "name": "_proposedFinalReferenceValue",
        "type": "uint256"
      }
    ],
    "name": "challengeFinalReferenceValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_positionToken",
        "type": "address"
      },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "redeemPositionToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_poolId", "type": "bytes32" },
      {
        "internalType": "uint256",
        "name": "_finalReferenceValue",
        "type": "uint256"
      },
      { "internalType": "bool", "name": "_allowChallenge", "type": "bool" }
    ],
    "name": "setFinalReferenceValue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "FinalValueAlreadySubmitted", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "tipper",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "collateralToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TipAdded",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "_poolId", "type": "bytes32" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "addTip",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "bytes32", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "internalType": "struct ITip.ArgsBatchAddTip[]",
        "name": "_argsBatchAddTip",
        "type": "tuple[]"
      }
    ],
    "name": "batchAddTip",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unit",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "pure",
    "type": "function"
  }
] as const