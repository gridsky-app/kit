import {makeHandleShort} from "./utilProfile";
import {getThreadPidFromUri} from "./utilThread";

export function isRouteProfile(route: RouteLocationNormalized) {
  return String(route.name).startsWith('handle') && Object.keys(route.params).length === 1
}

export function isRouteProfilePost(route: RouteLocationNormalized) {
  return String(route.name).startsWith('handle') && route.params && route.params.cid
}

export function isRouteFeed(route: RouteLocationNormalized) {
  return String(route.name).startsWith('handle') && Object.keys(route.params).length > 1
}

export function routeProfile(profile: BskyProfile) {
  return makeHandleShort(`/${profile.handle}`)
}

export function routeThread(thread: any) {
  return `${routeProfile(thread.post.author)}/p/${getThreadPidFromUri(thread.post.uri)}`
}
