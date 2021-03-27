# `@tcl/urn-resolver`

Resolves Asset URN for the `urn:telestoworld` namespace following the definition of https://github.com/common-metaverse/urn-namespaces

```bash
npm i @tcl/urn-resolver
```

```typescript
import { parseUrn } from '@tcl/urn-resolver'

const parsed = await parseUrn("urn:telestoworld:ropsten:SPACE:-10,-13?atBlock=151231111")
=> {
  uri: URL {
    href: 'urn:telestoworld:ropsten:SPACE:-10,-13?atBlock=151231111',
    protocol: 'urn:',
    pathname: 'telestoworld:ropsten:SPACE:-10,-13',
    search: '?atBlock=151231111',
    searchParams: URLSearchParams { 'atBlock' => '151231111' },
  },
  blockchain: 'ethereum',
  type: 'blockchain-asset',
  network: 'ropsten',
  contractAddress: '0x7a73483784ab79257bb11b96fd62a2c3ae4fb75b',
  id: '0xfffffffffffffffffffffffffffffff6fffffffffffffffffffffffffffffff3',
  x: -10,
  y: -13
}
```

# Registered routes

- `telestoworld:off-chain:{registry}:{name}`: Resolve static offchain assets (i.e. base wearables, not in any blockchain nor content server)
- `telestoworld:{protocol}:collections-v1:{contract(0x[a-fA-F0-9]+)}:{name}`: Resolve an ethereum wearables collection asset by contract address (v1)
- `telestoworld:{protocol}:collections-v1:{collection-name}:{name}`: Resolve an ethereum wearables collection asset by collection name (wearables API) (v1)
- `telestoworld:{protocol}:collections-v2:{contract(0x[a-fA-F0-9]+)}:{id}`: Resolve an ethereum wearables collection asset by contract address (v2)
- `telestoworld:{protocol}:SPACE:{x},{y}`: Resolves the ethereum asset of a SPACE position.
- `telestoworld:{protocol}:SPACE:{tokenId}`: Resolves the ethereum asset of a SPACE by tokenId.

# TelestoworldAssetIdentifier

It is an union type defined in the file [src/types.ts](src/types.ts), in that file you can find all the possible return types for URN resolution in this package.

# Contribute

## Install

You will need to install `jq`. If you are using MacOS you can install it by running: `brew install jq`.

The lib is being [built with node 14.x](.github/workflows/ci.yml).

```bash
make build
```

## Test

```bash
make test
```
