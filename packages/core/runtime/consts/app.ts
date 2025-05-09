export const dbVersion = 1

export const gridskyAeLabel = 'Æstetics'
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
        list: []
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
    animation: {
        enabled: true,
        showBannerInstead: false,
        colors: [
            '#0069ff',
            '#333333'
        ]
    }
}