import type {AtpSessionData} from "@atproto/api";
import type {OAuthSession} from "@atproto/oauth-client";
import { useAccountStore } from "./storeAccount"
import { useAccountAgentStore } from "./storeAccountAgent"
import { createAgent, createAgentOAuth } from "../utils/utilAtproto"
import { useAtprotoOAuth } from "../composables/useAtproto"
import { ref } from "vue"

export const useAccountSessionStore = defineStore("account/auth/session", () => {
    const accountStore = useAccountStore()
    const accountAgentStore = useAccountAgentStore()

    const sessions: Ref<{[did: string]: GskySession}> = ref({})
    const activeDid: Ref<string> = ref('')

    /**
     * Set session after a login
     *
     * @param did
     * @param session
     * @param handleResolver
     * @param sessionType
     */
    function setSession(did: string, session: any, handleResolver: string, sessionType: GskySessionType) {
        sessions.value[did] = {
            type: sessionType,
            account: null,
            value: session,
            resolver: handleResolver,
            updatedAt: Date.now(),
        }

        setActiveDid(did)
    }

    /**
     * Get session of a did
     *
     * @param did
     */
    function getSession(did: string): GskySession | undefined {
        return sessions.value[did]
    }

    /**
     * Set account info to session for Account Switcher
     * @param account
     */
    function setSessionAccount(account: BskyProfile) {
        if (sessions.value[account.did]) {
            // @ts-ignore
            sessions.value[account.did].account = account
        } else {
            debugError(`Session for DID ${account.did} does not exist.`);
        }
    }

    async function resumeSessionClassic(did: string): Promise<boolean> {
        const session = getSession(did)

        if (!session) {
            resetActiveSession()
            return Promise.resolve(false)
        }

        const classicAgent = createAgent(session.resolver, { did })

        await classicAgent
            .resumeSession(session.value)
            .then(async () => {
                setActiveDid(did)

                accountAgentStore.setAgent(did, classicAgent)

                //await refreshSession(did)
                return true
            })

        return true
    }

    function resumeSessionOAuthFinalStep(session: OAuthSession): boolean {
        const oauthAgent = createAgentOAuth(session)

        setSession(
            oauthAgent.assertDid,
            session,
            session.server.serverMetadata.issuer,
            'oauth'
        )

        accountAgentStore.setAgent(oauthAgent.assertDid, oauthAgent)

        return true
    }

    let refreshingPromise: Promise<any> | null = null

    async function refreshSession(did: string, forceRefresh: boolean = false): Promise<any> {
        if (refreshingPromise) {
            return refreshingPromise
        }

        const session = getSession(did)

        if (!session) {
            return
        }

        refreshingPromise = new Promise(async (resolve, reject) => {
            try {

                const classicAgent = createAgent(session.resolver, { did })

                const newSession = await classicAgent
                    .com.atproto.server
                    .refreshSession(
                        undefined,
                        {
                            headers: {
                                authorization: "Bearer " + session.value.refreshJwt,
                            },
                        },
                    )

                // set the new session to storeAccountSession
                setSession(did, newSession.data, session.resolver, 'classic')

                // overwrite session account data setting the same old session.account
                setSessionAccount(session.account)

                // resume session in the new classic agent
                await classicAgent.resumeSession(newSession.data)

                // set this new agent as the current private agent
                accountAgentStore.setAgent(did, classicAgent)

                if (newSession) {
                    resolve(newSession.data)
                } else {
                    reject("No session received")
                }

            } catch (err) {
                reject(err)
            } finally {
                refreshingPromise = null
            }
        })

        return refreshingPromise
    }

    /**
     * Switch account
     *
     * @param did
     */
    async function switchAccount(did: string): Promise<boolean> {
        const activeSession = getSession(did)

        if (!activeSession) {
            resetActiveSession()
            return false
        }

        switch (activeSession.type) {
            case 'classic':
                await resumeSessionClassic(did)
                break
            case 'oauth':
                await useAtprotoOAuth()
                    .restore(did)
                    .then(resumeSessionOAuthFinalStep)
        }

        setActiveDid(did)

        await accountStore.getAccount(true)

        return true

        // await runRepoMigrations(accountStore.account.did)
    }

    function setActiveDid(did: string) {
        activeDid.value = did
    }

    function resetActiveSession() {
      console.log('hehe 1')
      return
        accountStore.resetAccount()

        delete sessions.value[activeDid.value]

        setActiveDid('')
    }

    function invalidateActiveSession() {
      console.log('hehe 2')
      return
        const did = activeDid.value
        const session = sessions.value[did]

        if (session && session.value?.accessJwt) {
            session.value.accessJwt = 'invalid-' + Math.random().toString(36).substring(2)
            session.updatedAt = Date.now()
        }
    }

    return {
        sessions,
        activeDid,
        setSession,
        setSessionAccount,
        getSession,
        resumeSessionClassic,
        resumeSessionOAuthFinalStep,
        switchAccount,
        refreshSession,
        resetActiveSession,
        invalidateActiveSession,
    }
}, {
    persist: {storage: window.localStorage}
})
