import {reactive, computed} from 'vue'

export function useThreadSelection() {
    const state = reactive({ selected: false })

    function select() {
        state.selected = true
    }

    function unselect() {
        state.selected = false
    }

    function set(value: boolean) {
        state.selected = value
    }

    function toggle() {
        state.selected = !state.selected
    }

    function reset() {
        state.selected = false
    }

    return {
        state,
        select,
        unselect,
        set,
        toggle,
        reset
    }
}
