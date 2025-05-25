import { ref } from 'vue'
import { useAgent } from '@gridsky/core/runtime/composables/useAtproto'
import { useListBase } from '@gridsky/core/runtime/composables/useListBase'

export function useListSuggestionAccounts() {
    const baseList = useListBase()
    const cursor = ref<string | undefined>(undefined)

    async function requestItems() {
        const listOptions = {
            limit: 5,
            cursor: cursor.value,
        }

        const result = await useAgent('auto')
            .getSuggestions(listOptions)
            .catch(() => null)

        if (result) {
            cursor.value = result.data.cursor

            await baseList.appendItems({
                hasReachedEnd: !result.data.cursor,
                items: result.data.actors,
            })
        }
    }

    async function fetchList(restart = false) {
        baseList.isLoading.value = true

        if (restart) {
            cursor.value = undefined
            baseList.clearList()
        }

        await requestItems()

        baseList.isLoading.value = false
    }

    return {
        ...baseList,
        cursor,
        requestItems,
        fetchList,
    }
}
