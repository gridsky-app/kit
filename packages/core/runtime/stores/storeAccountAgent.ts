export const useAccountAgentStore = defineStore("account/agent", () => {
    const agents: Ref<{ [did: string]: GridskyAgent }> = ref({})

    function setAgent(did: string, agent: any) {
        agents.value[did] = agent
    }

    function getAgent(did: string) {
        return agents.value[did]
    }

    return {
        agents,
        getAgent,
        setAgent,
    }
})
