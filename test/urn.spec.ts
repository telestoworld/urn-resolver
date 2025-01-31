import expect from "expect"
import { TelestoworldAssetIdentifier, parseUrn } from "../src/index"
import { resolveEthereumAsset } from "../src/resolvers"

let counter = 0

function testValidUrnToInclude(urn: string, toInclude: Partial<TelestoworldAssetIdentifier>) {
  it(urn + " (" + ++counter + ")", async () => {
    expect(await parseUrn(urn)).toMatchObject(toInclude)
  })
}

describe("Basic use cases", function () {
  it("test unknown", async () => {
    expect(await parseUrn("urn:test")).toEqual(null)
  })

  it("Print SPACE resolution for readme", async () => {
    console.log(await parseUrn("urn:telestoworld:ropsten:SPACE:-10,-13?atBlock=151231111"))
  })

  it("test land", async () => {
    expect(
      await resolveEthereumAsset(new URL("urn:telestoworld:ethereum:SPACEPROXY:0x1"), {
        contract: "SPACEPROXY",
        protocol: "ethereum",
        tokenId: "0x1",
      })
    ).toMatchObject({
      contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      network: "mainnet",
      blockchain: "ethereum",
      type: "blockchain-asset",
      id: "0x1",
    })
  })

  it("test land (query string)", async () => {
    const t = await parseUrn("urn:telestoworld:ropsten:SPACE:0x1?atBlock=151231111#4")
    expect(t).toHaveProperty("uri")
    expect(t.uri.toString()).toEqual("urn:telestoworld:ropsten:SPACE:0x1?atBlock=151231111#4")
  })

  // it("test land (address)", async () => {
  //   expect(await parseUrn("urn:telestoworld:ethereum:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x1")).toMatchObject({
  //     contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
  //     type: "blockchain-asset",
  //     network: "mainnet",
  //     id: "0x1",
  //   })
  // })

  it("test land (ropsten)", async () => {
    expect(await parseUrn("urn:telestoworld:ropsten:SPACE:0x1")).toMatchObject({
      contractAddress: "0x7a73483784ab79257bb11b96fd62a2c3ae4fb75b",
      blockchain: "ethereum",
      network: "ropsten",
      id: "0x1",
    })
  })

  it("test land (mainnet) upper case", async () => {
    expect(await parseUrn("urn:telestoworld:ETHEREUM:SPACE:0x1")).toMatchObject({
      contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      blockchain: "ethereum",
      network: "mainnet",
      id: "0x1",
    })
  })

  it("portable experiences", async () => {
    expect(await parseUrn("urn:telestoworld:off-chain:static-portable-experiences:quest-1")).toMatchObject({
      id: "quest-1",
      registry: "static-portable-experiences",
      type: "off-chain",
    })
  })

  it("test collection v1", async () => {
    const r = await parseUrn(
      "urn:telestoworld:ethereum:collections-v1:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:test_name"
    )
    expect(r).toMatchObject({
      type: "blockchain-collection-v1",
      blockchain: "ethereum",
      network: "mainnet",
      contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      id: "test_name",
    })
  })

  it("test collection v2 (invalid id)", async () => {
    const r = await parseUrn(
      "urn:telestoworld:ethereum:collections-v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:test_name"
    )
    expect(r).toBeNull()
  })

  it("test collection v2", async () => {
    const r = await parseUrn("urn:telestoworld:ethereum:collections-v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0")
    expect(r).toMatchObject({
      blockchain: "ethereum",
      type: "blockchain-collection-v2",
      network: "mainnet",
      contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
      id: "0",
    })
  })
  testValidUrnToInclude("urn:telestoworld:ethereum:collections-v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0", {
    id: "0",
  })
  testValidUrnToInclude("urn:telestoworld:ethereum:collections-v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x1", {
    id: "0x1",
  })
  testValidUrnToInclude("urn:telestoworld:ethereum:collections-v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x0", {
    id: "0x0",
  })
  testValidUrnToInclude(
    "urn:telestoworld:ethereum:collections-v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:123456789",
    {}
  )
  testValidUrnToInclude(
    "urn:telestoworld:ethereum:collections-v2:0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d:0x000011111111111abcdef9087654321",
    {}
  )

  testValidUrnToInclude("urn:telestoworld:ethereum:SPACE:0,0", {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0x0",
  })

  testValidUrnToInclude(`urn:telestoworld:ethereum:SPACE:${encodeURIComponent("0,0")}`, {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0x0",
    x: 0,
    y: 0,
  })

  testValidUrnToInclude("urn:telestoworld:ethereum:SPACE:13,-137", {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0xdffffffffffffffffffffffffffffff77",
    x: 13,
    y: -137,
  })

  testValidUrnToInclude("urn:telestoworld:ethereum:SPACE:0xdffffffffffffffffffffffffffffff77", {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0xdffffffffffffffffffffffffffffff77",
    x: 13,
    y: -137,
  })

  testValidUrnToInclude("urn:telestoworld:ethereum:SPACE:4763953136893138488487244504044754960247", {
    contractAddress: "0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d",
    id: "0xdffffffffffffffffffffffffffffff77",
    x: 13,
    y: -137,
  })

  testValidUrnToInclude("urn:telestoworld:ethereum:collections-v1:community_contest:cw_bell_attendant_hat", {
    contractAddress: "0x32b7495895264ac9d0b12d32afd435453458b1c6",
    collectionName: "community_contest",
    id: "cw_bell_attendant_hat",
  })

  testValidUrnToInclude(
    "urn:telestoworld:ethereum:collections-v1:0x32b7495895264ac9d0b12d32afd435453458b1c6:cw_bell_attendant_hat",
    {
      contractAddress: "0x32b7495895264ac9d0b12d32afd435453458b1c6",
      collectionName: "community_contest",
      id: "cw_bell_attendant_hat",
    }
  )

  testValidUrnToInclude("urn:telestoworld:ethereum:collections-v1:InExIsTeNtCoLlEcTiOn19283719:maddona-modern-life", {
    contractAddress: null,
    collectionName: "InExIsTeNtCoLlEcTiOn19283719",
    id: "maddona-modern-life",
  })

  it("legacy address (base-avatars)", async () => {
    expect(await parseUrn("tcl://base-avatars/eyes_03")).toMatchObject({
      id: "eyes_03",
      namespace: "telestoworld",
      registry: "base-avatars",
      type: "off-chain",
    })

    const generatedUrl = (await parseUrn("tcl://base-avatars/eyes_03")).uri

    expect(generatedUrl.toString()).toEqual("urn:telestoworld:off-chain:base-avatars:eyes_03")
  })

  it("legacy address (collections v1)", async () => {
    expect(await parseUrn("tcl://halloween_2019/bride_of_frankie_earring")).toMatchObject({
      id: "bride_of_frankie_earring",
      namespace: "telestoworld",
      collectionName: "halloween_2019",
      type: "blockchain-collection-v1",
    })

    const generatedUrl = (await parseUrn("tcl://halloween_2019/bride_of_frankie_earring")).uri

    expect(generatedUrl.toString()).toEqual("urn:telestoworld:ethereum:collections-v1:halloween_2019:bride_of_frankie_earring")
  })

  it("legacy address (invalid)", async () => {
    expect(await parseUrn("tcl://base-avatars/")).toEqual(null)
    expect(await parseUrn("tcl://base-avatars")).toEqual(null)
    expect(await parseUrn("tcl://base-avatars/a/b/c")).toEqual(null)
  })

  it("sanity checks", async () => {
    expect(
      await parseUrn("urn:telestoworld:ethereum:collections-v2:0x1b8ba74cc34c2927aac0a8af9c3b1ba2e61352f2:0")
    ).toBeTruthy()
  })

  it("legacy address (valid)", async () => {
    expect(await parseUrn("tcl://base-avatars/f_sweater")).toBeTruthy()
    expect(await parseUrn("tcl://base-avatars/f_jeans")).toBeTruthy()
    expect(await parseUrn("tcl://base-avatars/bun_shoes")).toBeTruthy()
    expect(await parseUrn("tcl://base-avatars/standard_hair")).toBeTruthy()
    expect(await parseUrn("tcl://base-avatars/f_eyes_00")).toBeTruthy()
    expect(await parseUrn("tcl://base-avatars/f_eyebrows_00")).toBeTruthy()
    expect(await parseUrn("tcl://base-avatars/f_mouth_00")).toBeTruthy()
  })
})
