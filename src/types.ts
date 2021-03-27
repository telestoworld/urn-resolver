/**
 * @public
 */

export type BaseBlockchainAsset = {
  namespace: 'telestoworld'
  uri: URL
  /**
   * Ethereum for the time being.
   */
  blockchain: "ethereum"
  /**
   * mainnet | ropsten | matic and others.
   */
  network: string
  /**
   * Contract address where to find the asset
   */
  contractAddress: string
}

/**
 * @public
 */
export type BlockchainAsset = BaseBlockchainAsset & {
  type: "blockchain-asset"
  /**
   * Identifier of the asset. i.e. TokenID for ERC721 contracts
   */
  id: string
}

/**
 * @public
 */
export type BlockchainLandAsset = BlockchainAsset & {
  x: number
  y: number
}

/**
 * @public
 */
export type BlockchainCollectionV1Asset =  {
  namespace: 'telestoworld'
  uri: URL
  /**
   * Ethereum for the time being.
   */
  blockchain: "ethereum"
  /**
   * mainnet | ropsten | matic and others.
   */
  network: string
  /**
   * Contract address where to find the asset
   */
  contractAddress: string | null

  type: "blockchain-collection-v1"
  /**
   * Identifier of the asset (name)
   */
  id: string
  collectionName: string | null
}

/**
 * @public
 */
export type BlockchainCollectionV2Asset = BaseBlockchainAsset & {
  namespace: 'telestoworld'
  type: "blockchain-collection-v2"
  /**
   * Identifier of the asset (assetId)
   */
  id: string
}

/**
 * @public
 */
export type OffChainAsset = {
  namespace: 'telestoworld'
  uri: URL
  type: "off-chain"
  /**
   * Name of the registry that hosts the asset.
   */
  registry: string
  /**
   * ID of the asset.
   */
  id: string
}

/**
 * @public
 */
export type TelestoworldAssetIdentifier =
  | BlockchainAsset
  | OffChainAsset
  | BlockchainCollectionV1Asset
  | BlockchainCollectionV2Asset
  | BlockchainLandAsset
