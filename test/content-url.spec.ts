import expect from "expect"
import { ResolversOptions, resolveUrlFromUrn } from "../src"

function test(urn: string, contentUrl: string | null, options?: ResolversOptions) {
  it(urn, async () => {
    expect(await resolveUrlFromUrn(urn, options)).toEqual(contentUrl)
  })
}

describe("Content url generation", function () {
  test("telestoworld:off-chain:something:something-else", null)
  test(
    "urn:telestoworld:off-chain:static-portable-experiences:quest-1",
    "https://static-pe.telestoworld.io/quest-1/mappings"
  )
  test(
    "urn:telestoworld:ethereum:SPACE:4763953136893138488487244504044754960247",
    "https://peer.telestoworld.org/content/entities/scene?pointer=13,-137"
  )
  test(
    "urn:telestoworld:ropsten:SPACE:4763953136893138488487244504044754960247",
    "https://peer.telestoworld.zone/content/entities/scene?pointer=13,-137"
  )
  test(
    "urn:telestoworld:ropsten:SPACE:4763953136893138488487244504044754960247",
    "https://localhost:7666/content/entities/scene?pointer=13,-137",
    { contentServerHost: "localhost:7666" }
  )
  test("urn:telestoworld:ropsten:SPACE:-10,-13", "https://peer.telestoworld.zone/content/entities/scene?pointer=-10,-13")

  test(
    "urn:telestoworld:ethereum:collections-v1:community_contest:cw_bell_attendant_hat",
    "https://wearable-api.telestoworld.org/v2/collections/community_contest/wearables/cw_bell_attendant_hat"
  )

  test("urn:telestoworld:ethereum:collections-v1:base-avatars:eyes_03", null)

  test(
    "urn:telestoworld:off-chain:base-avatars:eyes_03",
    "https://wearable-api.telestoworld.org/v2/collections/base-avatars/wearables/eyes_03"
  )

  test(
    "tcl://base-avatars/eyes_03",
    "https://wearable-api.telestoworld.org/v2/collections/base-avatars/wearables/eyes_03"
  )

  test(
    "urn:telestoworld:ethereum:collections-v1:0x32b7495895264ac9d0b12d32afd435453458b1c6:cw_bell_attendant_hat",
    "https://wearable-api.telestoworld.org/v2/collections/community_contest/wearables/cw_bell_attendant_hat"
  )
})
