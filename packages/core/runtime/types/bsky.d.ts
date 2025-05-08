import {
  AppBskyActorDefs,
} from "@atproto/api";

declare global {
  type BskyProfile = AppBskyActorDefs.ProfileViewDetailed
  type BskyThread = any // todo
}
