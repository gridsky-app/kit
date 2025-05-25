export const useAccountAuthResolverStore = defineStore('account/auth/resolver', () => {
    const DEFAULT_SERVICE_RESOLVER = 'https://bsky.social'
    const handleResolver = ref(DEFAULT_SERVICE_RESOLVER)
    const handleResolverList = ref([])

    const handleResolverHostname = computed(() => {
        return new URL(handleResolver.value).hostname
    })

    function setHandleResolver(value: string) {
        handleResolver.value = value
    }

    return {
        handleResolver,
        handleResolverList,
        handleResolverHostname,
        setHandleResolver,
    }
}, {
    persist: {
        storage: localStorage,
    },
})

