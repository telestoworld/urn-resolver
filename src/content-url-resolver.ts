import { getContract } from "./helpers"
import { LandUtils } from "./land-utils"
import { TelestoworldAssetIdentifier } from "./types"

/**
 * @public
 */
export type ResolversOptions = Partial<{
  contentServerHost: string
  wearablesServerHost: string
}>

type ResolverFunction = (
  asset: TelestoworldAssetIdentifier,
  config: ResolversOptions
) => string | Promise<string | void> | void

const resolvers: ResolverFunction[] = []

/**
 * Resolves a base URL to locate the asset.
 * This URL may mutate, the URN is immutable.
 * @public
 */
export async function resolveContentUrl(
  asset: TelestoworldAssetIdentifier,
  config?: ResolversOptions
): Promise<string | null> {
  if (!asset) return null
  for (let resolver of resolvers) {
    const r = await resolver(asset, config || {})
    if (typeof r == "string" && r.length > 0) {
      return r
    }
  }
  console.dir(asset)
  return null
}

// ---------------------------------------------------------------------

resolvers.push(function resolvePortableExperiencesUrl(asset, options) {
  if (asset.type == "off-chain" && asset.registry == "static-portable-experiences") {
    return `https://static-pe.telestoworld.io/${asset.id}/mappings`
  }
})

resolvers.push(function resolvePortableExperiencesUrl(asset, options) {
  if (asset.type == "off-chain" && asset.registry == "base-avatars") {
    const host = defaultWearablesServerForNetwork("ethereum", options)
    return `https://${host}/v2/collections/${asset.registry}/wearables/${asset.id}`
  }
})

resolvers.push(function wearablesV1UrlResolver(asset, options) {
  if (asset.type == "blockchain-collection-v1" && asset.collectionName != "base-avatars") {
    const host = defaultWearablesServerForNetwork(asset.network, options)
    if (asset.collectionName) {
      return `https://${host}/v2/collections/${asset.collectionName}/wearables/${asset.id}`
    }
  }
})

resolvers.push(async function landResolver(asset, options) {
  if (
    asset.type == "blockchain-asset" &&
    asset.contractAddress.toLowerCase() == (await getContract(asset.network, "SPACEProxy"))
  ) {
    const host = defaultContentServerForNetwork(asset.network, options)
    const { x, y } = LandUtils.decodeTokenId(asset.id)
    return `https://${host}/content/entities/scene?pointer=${x},${y}`
  }
})

function defaultContentServerForNetwork(network: string, options: ResolversOptions) {
  if (options.contentServerHost) return options.contentServerHost
  if (network == "ropsten") {
    return `peer.telestoworld.zone`
  }
  return `peer.telestoworld.org`
}

function defaultWearablesServerForNetwork(network: string, options: ResolversOptions) {
  if (options.wearablesServerHost) return options.wearablesServerHost
  if (network == "ropsten") {
    return `wearable-api.telestoworld.zone`
  }
  return `wearable-api.telestoworld.org`
}
