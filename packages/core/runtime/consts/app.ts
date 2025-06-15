export const dbVersion = 1

export const gridskyAeLabel = 'Æsthetics'
export const gridskyAeIcon = 'Æ'

export const gridskyCollectionPreferences = 'app.gridsky.preferences'
export const gridskyCollectionPreferencesKeyConfig = 'config'

export const gridskyCollectionGrid = 'app.gridsky.grid'
export const gridskyCollectionGridKeyList = 'list'

export const gridskyCollectionThreadDraft = 'app.gridsky.draft'
export const gridskyCollectionThreadDraftKeyList = 'list'

export const defaultConfigProfileGridList: GridskyProfileRawGrid[] = [
    {
        name: 'default',
        label: 'Posts',
        layout: '1-1',
        posts: []
    }
]

export const defaultConfigProfileAppearance = {
    theme: {
        name: 'gridgram',
        variant: '',
        dark: true,
        colorPrimary: '#0095f6',
        backgroundTone: ''
    },
    banner: {
        enabled: true,
        gridskyEnabled: true,
        gridskyColors: [
          '#0069ff',
          '#333333'
        ],
        blueskyEnabled: false,
        shadertoyEnabled: false,
        shadertoyId: '',
    }
}
