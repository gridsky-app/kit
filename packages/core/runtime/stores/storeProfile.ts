import {defineStore} from "pinia"
import {ref, toRaw, computed} from "vue"
import {useProfileGridStore} from "./storeProfileGrid";
import {
  getProfile,
  makeHandleLonger,
  resolveActorDid,
  resolveActorServiceEndpoint
} from "@gridsky/core/runtime/utils/utilProfile"
import {generateId} from "@gridsky/core/runtime/utils/utilString"
import {isLogged} from "@gridsky/core/runtime/utils/utilAccount";

interface PendingProfileRequest {
  onCache?: (data: any) => void
  onRemote?: (data: any) => void
}

const pendingProfileRequests = new Map<string, PendingProfileRequest>()

const worker = new Worker(
  new URL('@gridsky/core/runtime/workers/workerProfile.ts', import.meta.url),
  {type: 'module'}
)

worker.addEventListener('message', (event) => {
  const {type, requestId, result} = event.data

  const pendingRequest = pendingProfileRequests.get(requestId)

  if (!pendingRequest) return

  if (type === 'profileLoadedFromCache') {
    pendingRequest.onCache?.(result)
    if (!navigator.onLine) {
      pendingProfileRequests.delete(requestId)
    }
  } else if (type === 'profileLoadedFromRemote') {
    pendingRequest.onRemote?.(result)
    pendingProfileRequests.delete(requestId)
  }
})

export const useProfileStore = function (profileHandle: string) {
  const handleFull = makeHandleLonger(profileHandle)

  return defineStore(`profile/${handleFull}`, () => {
    const profileGridStore = useProfileGridStore(profileHandle)

    const serviceEndpoint = ref<string>('')
    const did = ref<string>('')
    const handle = ref<string>(handleFull)

    const profile = ref<BskyProfile>(undefined as BskyProfile)

    const appearance = ref({
      theme: {
        name: '',
        variant: '',
        colorPrimary: '',
        backgroundTone: '',
      },
      banner: {
        enabled: true,
        gridskyColors: []
      }
    })

    const premium = ref<GskyProfilePremium | null>(null)

    const isLoading = ref(false)
    const isReady = ref(false)

    /**
     * Load the profile using the web worker.
     *
     * It runs the onCache promise if cache is available
     * then if fetches the complete profile with remote data
     *
     * @param callback
     */
    async function loadProfile(callback?: any): Promise<void> {
      if (isReady.value) {
        return
      }

      const requestId = generateId(8)

      function handleWorkerProfileResponse(data) {
        setData(data)

        // pass fetched profile data to an additional callback
        // (for example to update the account store data too)
        if (typeof callback === 'function') {
          callback(data)
        }

        isLoading.value = false
        isReady.value = true
      }

      // run worker / send instructions to the web worker
      worker.postMessage({
        type: 'loadProfile',
        knownData: knownData.value,
        requestId,
      })

      isLoading.value = true

      const loadProfilePromises: Promise<any>[] = [
        // each request will be resolved when the web worker returns the data we asked
        // like the full profile (it first returns it from the cache, then from remote)
        new Promise((resolve) => {
          pendingProfileRequests.set(requestId, {
            onCache: (cacheData) => {
              handleWorkerProfileResponse(cacheData)
              resolve(true)
            },
            onRemote: (remoteData) => {
              handleWorkerProfileResponse(remoteData)
              resolve(true)
            }
          })
        }),
      ]

      if (isLogged()) {

        // since the web worker doesn't handle the oauth session
        // we have to fetch the profile also from the client to get
        // the viewer property (for known followers and more)
        loadProfilePromises.push(
          getProfile(makeHandleLonger(profileHandle))
        )

      }

      const [workerResult, profileResult] = await Promise.allSettled(
        loadProfilePromises
      )

      if (profileResult && profileResult.status === 'fulfilled') {
        profile.value.viewer = profileResult.value.viewer
      }
    }

    /**
     * Is profile premium?
     */
    const isPremium = computed(() => {
      if (!premium.value) {
        return false
      }

      return !!premium.value.active
    })

    /**
     * Object with all the profile data that has been already fetched
     */
    const knownData = computed(() => {
      return {
        did: did.value,
        handle: handle.value,
        serviceEndpoint: serviceEndpoint.value,
        // better not to pass the profile since
        // it is initialized in the profile middleware
        // with really minimum data (like the handle)
        // profile: toRaw(profile.value),
        appearance: undefined,
        premium: toRaw(premium.value),
      }
    })

    /**
     * Known followers of the profile to be used in the avatar stack
     */
    const knownFollowers = computed(() => {
      if (!profile.value.viewer) {
        return []
      }

      return profile.value.viewer.knownFollowers.followers.slice(0, 3)
    })

    /**
     * Resolve the profile did from the handle
     */
    async function resolveDid() {
      if (did.value) {
        return did.value
      }

      did.value = await resolveActorDid(handle.value)

      return did.value
    }

    /**
     * Resolve the service endpoint from the profile did
     */
    async function resolveServiceEndpoint() {
      if (serviceEndpoint.value) {
        return serviceEndpoint.value
      }

      serviceEndpoint.value = await resolveActorServiceEndpoint(did.value)

      return serviceEndpoint.value
    }

    /**
     * Helper to set all the data
     *
     * @param data
     */
    function setData(data: {
      did?: string,
      serviceEndpoint?: string,
      profile?: BskyProfile,
      premium?: GskyProfilePremium,
      appearance?: GskyProfileAppearance,
      gridList?: GskyProfileGridList,
    }) {
      if (data.serviceEndpoint) {
        serviceEndpoint.value = data.serviceEndpoint
      }

      if (data.did) {
        did.value = data.did
      }

      if (data.profile) {
        setProfile(data.profile)
      }

      if (data.premium) {
        setProfilePremium(data.premium)
      }

      if (data.appearance) {
        setProfileAppearance(data.appearance)
      }

      if (data.gridList) {
        profileGridStore.setProfileGridList(data.gridList)
      }
    }

    function setProfile(value: BskyProfile) {
      profile.value = value
    }

    function setProfilePremium(data: GskyProfilePremium) {
      premium.value = data
    }

    function setProfileAppearance(data: GskyProfileAppearance) {
      appearance.value = data
    }

    const pageTitle = computed(() => {
      return profile.value.displayName
        ? `${profile.value.displayName} (@${profile.value.handle})`
        : `@${profile.value.handle}`
    })

    return {
      did,
      serviceEndpoint,
      profile,
      appearance,
      knownFollowers,
      premium,
      isPremium,
      isLoading,
      isReady,

      loadProfile,
      resolveDid,
      resolveServiceEndpoint,
      setProfile,
      setProfilePremium,
      setProfileAppearance,
      setData,

      pageTitle,
    }
  })()
}

