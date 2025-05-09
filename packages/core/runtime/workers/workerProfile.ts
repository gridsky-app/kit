import {WorkerModelProfileStorage} from "./models/WorkerModelProfileStorage";
import {WorkerModelProfileFetch} from "./models/WorkerModelProfileFetch";

const fetcherStorage = new WorkerModelProfileStorage()

self.addEventListener('message', async (event) => {
  const {type} = event.data;

  await fetcherStorage.openStorage()

  switch (type) {
    case 'loadProfile':
      let { knownData, requestId } = event.data;

      const fetcherRemote = new WorkerModelProfileFetch()

      /*
      let cachedResult = await fetcherStorage.getProfileFromStorage(knownData);

      if (cachedResult) {
        self.postMessage({
          type: 'profileLoadedFromCache',
          requestId,
          handle: cachedResult.profile.handle,
          result: cachedResult
        })
      }
       */

      if (navigator.onLine) {
        try {
          const freshResult = await fetcherRemote.getProfileFromRemote(knownData);

          await fetcherStorage.saveProfileToStorage(knownData.did, freshResult);

          self.postMessage({
            type: 'profileLoadedFromRemote',
            requestId,
            //handle: freshResult.profile.handle,
            result: freshResult
          })
        } catch (error) {
          console.error('Failed to fetch fresh profile:', error)
        }
      }

      /*
       else if (!cachedResult) {
        throw new Error('Profile not found and offline')
      }
       */

      return
  }
})

self.addEventListener('close', () => {
  fetcherStorage.closeStorage()
})
