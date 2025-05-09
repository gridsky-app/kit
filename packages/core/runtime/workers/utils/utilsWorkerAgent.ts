import {AtpAgent} from "@atproto/api";

export async function useWorkerAgent(configAgent?: any) {
    let agent

    if (configAgent && configAgent.session) {
        agent = new AtpAgent(configAgent)

        await agent.resumeSession(configAgent.session)
    } else {
        agent = useWorkerAgentWithService()
    }

    return agent
}

export function useWorkerAgentWithService(serviceEndpoint = 'https://public.api.bsky.app') {
    return new AtpAgent({ service: serviceEndpoint })
}
