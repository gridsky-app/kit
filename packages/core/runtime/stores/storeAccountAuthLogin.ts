import {createAgent} from '@gridsky/core/runtime/utils/utilAtproto'
import {useAccountStore} from '@gridsky/core/runtime/stores/storeAccount'
import {useAccountSessionStore} from '@gridsky/core/runtime/stores/storeAccountSession'
import {useAccountAgentStore} from '@gridsky/core/runtime/stores/storeAccountAgent'
import {useAccountAuthResolverStore} from '@gridsky/core/runtime/stores/storeAccountAuthResolver'
import { required, maxLength, minLength, email, helpers } from "@vuelidate/validators";

export const useAccountAuthLoginStore = defineStore('account/auth/login', () => {
    const accountStore = useAccountStore()
    const accountAuthResolverStore = useAccountAuthResolverStore()
    const accountSessionStore = useAccountSessionStore()
    const accountAgentStore = useAccountAgentStore()

    const fieldIdentifier = ref('')
    const fieldPassword = ref('')
    const fieldAuthFactorToken = ref('')

    const rules = {
        fieldIdentifier: {
            required,
            maxLength: maxLength(256),
        },
        fieldPassword: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(128)
        },
        fieldAuthFactorToken: {
            minLength: minLength(11),
            maxLength: maxLength(11)
        },
    }

    const $v = useVuelidate(rules, {
        fieldIdentifier,
        fieldPassword,
        fieldAuthFactorToken,
    }, {
        $lazy: true
    })

    async function login() {
        const agent = createAgent(accountAuthResolverStore.handleResolver)

        return agent
            .login({
                identifier: makeHandleLonger(fieldIdentifier.value),
                password: fieldPassword.value,
                authFactorToken: fieldAuthFactorToken.value,
            })
            .then(async (session) => {
                // populate session archive
                accountSessionStore.setSession(
                    session.data.did,
                    session.data,
                    accountAuthResolverStore.handleResolver,
                    'classic',
                )

                // set current agent
                accountAgentStore.setAgent(session.data.did, agent)

                // refresh full account data
                await accountStore.getAccount(true)

                // route to home
                useRouter().push('/').then(() => {
                    // reset login form
                    setTimeout(reset, 1000)
                })

            })
            .catch(e => {
                console.error(e)
            })
    }

    async function loginOAuth() {
        // it's just a shortcut
        await useAtprotoOAuth().oauthLogin()
    }

    function reset() {
        fieldIdentifier.value = fieldPassword.value = fieldAuthFactorToken.value = ""

        $v.value.$reset()
    }

    return {
        rules,
        $v,
        fieldIdentifier,
        fieldPassword,
        fieldAuthFactorToken,
        login,
        loginOAuth,
        reset,
    }
})

