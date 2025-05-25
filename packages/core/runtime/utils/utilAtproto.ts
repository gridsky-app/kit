import {Agent, AtpAgent} from "@atproto/api";
import { useAccountSessionStore } from "@gridsky/core/runtime/stores/storeAccountSession"
import { useNoticeStore } from "@gridsky/core/runtime/stores/storeNotice"

export function getAtprotoServiceEndpoint(serviceName: string | 'public'): string {
    switch (serviceName) {
        case 'public':
            return 'https://public.api.bsky.app'
        default:
            return serviceName
    }
}

export function createAgent(serviceName: 'public' | string, fetchMeta?: { did?: string }) {
    return new AtpAgent({
        service: ['public'].includes(serviceName) ? getAtprotoServiceEndpoint(serviceName) : serviceName,
        fetch: (url, options) => customFetch(url, options, fetchMeta)
    })
}

export function createAgentOAuth(session: any) {
    return new Agent(session)
}

export async function customFetch(input: RequestInfo | URL, fetchConfig?: RequestInit, fetchMeta?: { did?: string }): Promise<Response> {
    const accountSessionStore = useAccountSessionStore()
    const noticeStore = useNoticeStore()

    try {
        let response = await fetch(input, fetchConfig)

        if (!response.ok) {
            const data = await response.json()

            if (['InvalidToken', 'ExpiredToken'].includes(data.error)) {
                const newSession = await accountSessionStore.refreshSession(fetchMeta.did, true)

                if (newSession) {
                    fetchConfig = {
                        ...fetchConfig,
                        headers: {
                            ...(fetchConfig?.headers || {}),
                            authorization: "Bearer " + newSession.accessJwt,
                        },
                    }

                    response = await fetch(input, fetchConfig)

                    return response
                }
            }

            // todo to improve this, remove ExpiredToken and wait
            if (['ExpiredToken', 'RecordNotFound', 'InvalidRequest', 'InternalServerError'].includes(data.error)) {
                return false
            } else {
                noticeStore.setNotice(data)
            }
        }

        return response
    } catch(error) {
        console.error('damn', error)
    }
}
