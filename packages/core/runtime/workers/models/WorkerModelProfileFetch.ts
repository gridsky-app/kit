import {AtpAgent} from "@atproto/api";
import {useWorkerAgentWithService} from "../utils/utilWorkerAgent";
import {workerSlugify} from "../utils/utilWorkerString";
import {defaultConfigProfileAppearance, defaultConfigProfileGridList} from "../../consts/app";

export class WorkerModelProfileFetch {
  public agent: AtpAgent = {} as AtpAgent

  private handle = ''
  private did = ''
  private serviceEndpoint = ''

  private profile
  private appearance: GridskyProfileAppearance = defaultConfigProfileAppearance
  private gridList: GridskyProfileRawGrid[] = []
  private premium: null | GskyProfilePremium = null

  constructor() {
  }

  public async getProfileFromRemote(knownData: any) {
    if (!knownData.did) {
      await this.resolveProfileDidFromHandle(knownData.handle)
    } else {
      this.did = knownData.did
    }

    if (!knownData.serviceEndpoint) {
      await this.resolveProfileServiceEndpointFromDid()
    } else {
      this.serviceEndpoint = knownData.serviceEndpoint
    }

    this.agent = useWorkerAgentWithService(this.serviceEndpoint)

    const promises = []

    if (!knownData.profile) {
      promises.push(this.getProfileX())
    } else {
      this.profile = knownData.profile
    }

    if (!knownData.appearance) {
      promises.push(this.getGridskyProfileAppearanceX())
    } else {
      this.appearance = knownData.appearance
    }

    if (!knownData.gridList) {
      promises.push(this.getGridskyProfileGridsX())
    } else {
      this.gridList = knownData.gridList
    }

    if (!knownData.premium) {
      promises.push(this.getGridskyPremiumX())
    } else {
      this.premium = knownData.premium
    }

    await Promise.allSettled(promises)

    return {
      did: this.did,
      serviceEndpoint: this.serviceEndpoint,
      profile: this.profile,
      appearance: this.appearance,
      gridList: this.gridList,
      premium: this.premium,
    }
  }

  public async resolveProfileDidFromHandle(handle: string) {
    const {did} = await useWorkerAgentWithService()
      .com.atproto.identity
      .resolveHandle({handle})
      .then(result => result.data)

    this.did = did

    return did
  }

  private async resolveProfileServiceEndpointFromDid() {
    const response = await fetch(`https://plc.directory/${this.did}`)

    if (!response.ok) {
      throw new Error('Failed to fetch profile service endpoint');
    }

    const data = await response.json()
    this.serviceEndpoint = data.service[0].serviceEndpoint
  }

  private async getProfileX() {
    this.profile = (
      await useWorkerAgentWithService().getProfile({
        actor: this.did,
      })
    ).data
  }

  private async getGridskyProfileGridsX() {
    function isValidGridData(data: any): boolean {
      return (
        data &&
        data.value &&
        Array.isArray(data.value.list) &&
        data.value.list.length > 0
      )
    }

    function normalizeGridList(list: any[]): GridskyProfileRawGrid[] {
      return list.map((item) => ({
        label: item.label || 'Posts',
        id: item.id ?? item.name ?? generateId(8),
        name: item.name || workerSlugify(item.label || 'Posts'),
        layout: item.layout || '1-1',
        posts: item.posts || []
      }))
    }

    const response: any = await this.getGridskyRecordX('app.gridsky.grid', 'list')
    const data = response.data

    if (!isValidGridData(data)) {
      this.gridList = defaultConfigProfileGridList
      return
    }

    this.gridList = normalizeGridList(data.value.list)
  }

  private async getGridskyProfileAppearanceX() {
    function isValidAppearanceData(data: any): boolean {
      return (
        data &&
        data.value &&
        data.value.theme &&
        data.value.banner
      )
    }

    function normalizeAppearanceConfigX(data: any, config: any): any {
      if (data.value.theme) {
        if (typeof data.value.theme.dark !== 'undefined') {
          config.theme.dark = data.value.theme.dark
        }
        if (data.value.theme.name) {
          config.theme.name = data.value.theme.name
        }
        if (data.value.theme.variant) {
          config.theme.variant = data.value.theme.variant
        }
        if (data.value.theme.colorPrimary) {
          config.theme.colorPrimary = data.value.theme.colorPrimary
        }
        if (data.value.theme.backgroundTone) {
          config.theme.backgroundTone = data.value.theme.backgroundTone
        }
        config.theme.sidebarCustomBlocks = !!data.value.theme.sidebarCustomBlocks
      }

      if (data.value.banner) {
        if (typeof data.value.banner.enabled !== 'undefined') {
          config.banner.enabled = data.value.banner.enabled
        }
        if (data.value.banner.gridskyColors && Array.isArray(data.value.banner.gridskyColors)) {
          config.banner.gridskyColors = data.value.banner.gridskyColors
        }
        if (typeof data.value.banner.gridskyEnabled !== 'undefined') {
          config.banner.gridskyEnabled = Boolean(data.value.banner.gridskyEnabled)
        }
        if (typeof data.value.banner.blueskyEnabled !== 'undefined') {
          config.banner.blueskyEnabled = Boolean(data.value.banner.blueskyEnabled)
        }
        if (typeof data.value.banner.shadertoyEnabled !== 'undefined') {
          config.banner.shadertoyEnabled = Boolean(data.value.banner.shadertoyEnabled)
        }
        if (data.value.banner.shadertoyId) {
          config.banner.shadertoyId = String(data.value.banner.shadertoyId)
        }
      }

      if (data.value.feedCategories) {
        config.feedCategories = data.value.feedCategories
      }

      if (data.value.searchCategories) {
        config.searchCategories = data.value.searchCategories
      }

      if (data.value.sidebars) {
        const sanitizedSidebars: AccountSidebars = {};

        Object.keys(data.value.sidebars).forEach(key => {
          const sidebarItems = data.value.sidebars[key];

          sanitizedSidebars[key] = []

          if (sidebarItems && Array.isArray(sidebarItems)) {
            for (const sidebar of sidebarItems) {
              sanitizedSidebars[key].push({
                name: sidebar.name,
              })
            }
          }
        });

        config.sidebars = sanitizedSidebars;
      }

      return config
    }

    const response: any = await this.getGridskyRecordX('app.gridsky.preferences', 'config')

    if (!isValidAppearanceData(response.data)) {
      this.appearance = defaultConfigProfileAppearance
    }

    this.appearance = normalizeAppearanceConfigX(response.data, defaultConfigProfileAppearance)
  }


  private async getGridskyRecordX(collection: string, key: string) {
    return this.agent
      .com.atproto.repo.getRecord({
        repo: this.did,
        collection: collection,
        rkey: key,
      }).catch(() => ({data: null}))
  }

  private async getGridskyPremiumX() {
    this.premium = await fetch(`https://ae.gridsky.app/status?did=${this.did}`, {mode: "cors"})
      .then(async response => {
        if (!response.ok) {
          return null
        }

        return response.json()
      })
      .catch(() => null)
  }
}
