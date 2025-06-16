export const dbVersion = 1

export const gridskyAeLabel = 'Æsthetics'
export const gridskyAeIcon = 'Æ'
export const gridskyAeLifetimePerksQuota = 4800

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
    gridskyColors: [
      '#0069ff',
      '#333333'
    ],
    gridskyEnabled: true,
    blueskyEnabled: false,
    shadertoyEnabled: false,
    shadertoyId: '3ftSz2',
  }
}

export const patreonTiers = [
  { name: 'Starter', price: '$2', polar: 'polar_cl_hu6aZ9BmzClmwVUx9JsfGld2WdwNSyWO561wP0OD57x', patreonId: 21631597 },
  { name: 'Believer', price: '$4', polar: 'polar_cl_5535iXYelwY3dxMFdzLFBNyQv5Afjse7cFgSf2iR4FT', patreonId: 21631604, preferred: true, },
  { name: 'Enthusiast', price: '$8', polar: 'polar_cl_4JNCHocTIgZovvxAxeWKlJQR4loA3YZFXeik34NnRzE', patreonId: 24493849 },
  { name: 'Majestic', price: '$12', polar: 'polar_cl_CDKQ8KjCQNqsSY3DVNFIz6tRXMRV7H6KRWf8K3kZ3ae', patreonId: 25359099 },
  { name: 'Supreme', price: '$24', polar: 'polar_cl_vTWbkLqfW3xNnLbudOX8uJ8A3UKUpg76bfhoC3pgk6h', patreonId: 25359105 },
  { name: 'Visionary', price: '$48', polar: 'polar_cl_8mNn9QqKYOHMt6S8eQK8Xh6uQMumkU0pAelMH1GoA9M', once: true, patreonId: 25359115 },
]
