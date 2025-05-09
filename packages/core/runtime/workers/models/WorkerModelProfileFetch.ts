import {AtpAgent} from "@atproto/api";
import {useWorkerAgentWithService} from "../utils/utilsWorkerAgent";
import {workerSlugify} from "../utils/utilsWorkerString";
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
      promises.push(this.getProfile())
    } else {
      this.profile = knownData.profile
    }

    if (!knownData.appearance) {
      promises.push(this.getGridskyProfileAppearance())
    } else {
      this.appearance = knownData.appearance
    }

    if (!knownData.gridList) {
      promises.push(this.getGridskyProfileGrids())
    } else {
      this.gridList = knownData.gridList
    }

    if (!knownData.premium) {
      promises.push(this.getGridskyPremium())
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

  private async getProfile() {
    this.profile = (
      await useWorkerAgentWithService().getProfile({
        actor: this.did,
      })
    ).data
  }

  private async getGridskyProfileGrids() {
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
        name: item.name || workerSlugify(item.label || 'Posts'),
        layout: item.layout || '1-1',
        posts: item.posts || []
      }))
    }

    const response: any = await this.getGridskyRecord('app.gridsky.grid', 'list')
    const data = response.data

    if (!isValidGridData(data)) {
      this.gridList = defaultConfigProfileGridList
      return
    }

    this.gridList = normalizeGridList(data.value.list)
  }

  private async getGridskyProfileAppearance() {
    function isValidAppearanceData(data: any): boolean {
      return (
        data &&
        data.value &&
        data.value.theme &&
        data.value.animation
      )
    }

    function normalizeAppearanceConfig(data: any, config: any): any {
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
        if (dapromisesta.value.theme.colorPrimary) {
          config.theme.colorPrimary = data.value.theme.colorPrimary
        }
        if (data.value.theme.backgroundTone) {
          config.theme.backgroundTone = data.value.theme.backgroundTone
        }
        config.theme.sidebarCustomBlocks = !!data.value.theme.sidebarCustomBlocks
      }

      if (data.value.animation) {
        if (typeof data.value.animation.enabled !== 'undefined') {
          config.animation.enabled = data.value.animation.enabled
        }
        if (data.value.animation.colors) {
          config.animation.colors = data.value.animation.colors
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

    const response: any = await this.getGridskyRecord('app.gridsky.preferences', 'config')

    if (!isValidAppearanceData(response.data)) {
      this.appearance = defaultConfigProfileAppearance
    }

    this.appearance = normalizeAppearanceConfig(response.data, defaultConfigProfileAppearance)
  }

  private async getGridskyRecord(collection: string, key: string) {
    return this.agent
      .com.atproto.repo.getRecord({
        repo: this.did,
        collection: collection,
        rkey: key,
      }).catch(() => ({data: null}))
  }

  private async getGridskyPremium() {
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
