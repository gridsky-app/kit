export const useNoticeStore = defineStore("error", () => {
    const notice: Ref<null | GridskyNotice> = ref(null)

    function setNotice(data: GridskyNotice) {
        notice.value = {
            code: data.error,
            message: data.message,
            persistent: !!data.persistent,
        }
    }

    return {
        setNotice,
        notice,
    }
})
