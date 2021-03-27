import { createParser, getCollection, getContract, isValidProtocol, RouteMap } from "./helpers"
import { LandUtils } from "./land-utils"
import {
  BlockchainAsset,
  OffChainAsset,
  BlockchainCollectionV1Asset,
  BlockchainCollectionV2Asset,
  BlockchainLandAsset,
  TelestoworldAssetIdentifier,
} from "./types"

/**
 * Ordered map of resolvers.
 * @public
 */
export const resolvers: RouteMap<TelestoworldAssetIdentifier> = {
  // Resolver for static offchain assets (quests deployed to static servers, not content server)
  "telestoworld:off-chain:{registry}:{name}": resolveOffchainAsset,
  // collections v1 (by contract)
  "telestoworld:{protocol}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}": resolveCollectionV1Asset,
  // collections v1 (by name)
  "telestoworld:{protocol}:collections-v1:{collectionName}:{name}": resolveCollectionV1AssetByCollectionName,
  // collections v2 (hex)
  "telestoworld:{protocol}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id(0x[a-fA-F0-9]+)}": resolveCollectionV2Asset,
  // collections v2 (id)
  "telestoworld:{protocol}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id([0-9]+)}": resolveCollectionV2Asset,
  // resolve SPACE by position
  "telestoworld:{protocol}:SPACE:{position}": resolveLandAsset,
}

export const internalResolver = createParser(resolvers)

export async function resolveLandAsset(
  uri: URL,
  groups: Record<"protocol" | "position", string>
): Promise<BlockchainLandAsset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, "LandProxy")

  let { x, y } = LandUtils.parseParcelPosition(groups.position)

  if (isNaN(x) || isNaN(y)) {
    const decoded = LandUtils.decodeTokenId(groups.position)
    x = Number(decoded.x)
    y = Number(decoded.y)
  }

  if (isNaN(x) || isNaN(y)) return

  const tokenId = LandUtils.encodeTokenId(x, y)

  if (contract) {
    const r = await resolveEthereumAsset(uri, {
      contract,
      protocol: groups.protocol.toLowerCase(),
      tokenId: "0x" + tokenId.toString(16),
    })

    if (r)
      return {
        ...r,
        x,
        y,
      }
  }
}

export async function resolveLegacyDclUrl(uri: URL) {
  let host: string
  let path: string[]
  if (uri.pathname.startsWith('//')) {
    // Web URL object does not recognize tcl:// and therefore pathname has an extra /
    let res = uri.pathname.replace(/^\/\//, "").split("/")
    host = res[0]
    path = res.slice(1)
  } else {
    host = uri.host
    path = uri.pathname.replace(/^\//, "").split("/")
  }

  if (uri.protocol == "tcl:" && path.length == 1) {
    if (host == "base-avatars") {
      return internalResolver(`urn:telestoworld:off-chain:base-avatars:${path[0]}`)
    } else {
      return internalResolver(`urn:telestoworld:ethereum:collections-v1:${host}:${path[0]}`)
    }
  }
}

export async function resolveEthereumAsset(
  uri: URL,
  groups: Record<"protocol" | "contract" | "tokenId", string>
): Promise<BlockchainAsset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, groups.contract)

  if (contract)
    return {
      namespace: "telestoworld",
      uri,
      blockchain: "ethereum",
      type: "blockchain-asset",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      contractAddress: contract,
      id: groups.tokenId,
    }
}

export async function resolveOffchainAsset(
  uri: URL,
  groups: Record<"name" | "registry", string>
): Promise<OffChainAsset | void> {
  return {
    namespace: "telestoworld",
    uri,
    type: "off-chain",
    registry: groups.registry,
    id: groups.name,
  }
}

export async function resolveCollectionV1AssetByCollectionName(
  uri: URL,
  groups: Record<"protocol" | "collectionName" | "name", string>
): Promise<BlockchainCollectionV1Asset | void> {
  // this only works in mainnet
  if (groups.protocol != "ethereum") return

  const collection = await getCollection(groups.collectionName)

  return {
    namespace: "telestoworld",
    uri,
    blockchain: "ethereum",
    type: "blockchain-collection-v1",
    network: groups.protocol.toLowerCase(),
    contractAddress: (collection && collection.contractAddress) || null,
    id: groups.name,
    collectionName: (collection && collection.collectionId) || groups.collectionName,
  }
}

export async function resolveCollectionV1Asset(
  uri: URL,
  groups: Record<"protocol" | "contract" | "name", string>
): Promise<BlockchainCollectionV1Asset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, groups.contract)

  if (contract) {
    const collection = await getCollection(contract)

    return {
      namespace: "telestoworld",
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-v1",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      contractAddress: contract,
      id: groups.name,
      collectionName: collection ? collection.collectionId : null,
    }
  }
}

export async function resolveCollectionV2Asset(
  uri: URL,
  groups: Record<"protocol" | "contract" | "id", string>
): Promise<BlockchainCollectionV2Asset | void> {
  if (!isValidProtocol(groups.protocol)) return

  const contract = await getContract(groups.protocol, groups.contract)

  if (contract)
    return {
      namespace: "telestoworld",
      uri,
      blockchain: "ethereum",
      type: "blockchain-collection-v2",
      network: groups.protocol == "ethereum" ? "mainnet" : groups.protocol.toLowerCase(),
      contractAddress: contract,
      id: groups.id,
    }
}
