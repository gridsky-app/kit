export const useNoticeStore = defineStore("error", () => {
    const error: Ref<null | any> = ref(null)

    function setNotice(data: any) {
        error.value = {
            code: data.error,
            message: data.message
        }
    }

    return {
        setNotice,
        error,
    }
})