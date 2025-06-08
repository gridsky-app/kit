const worker = new Worker(new URL('../workers/workerFeed.ts', import.meta.url), { type: 'module' });

export function useListFeedWorker(workerConfig: object) {
  function postMessage(message: { type: string, config: any, response: any }) {
    worker.postMessage(message);
  }

  function setWorkerConfig(config: object) {
    postMessage('setWorkerConfig', { config });
  }

  setWorkerConfig(workerConfig);

  function listenOnce(eventType: string, callback: (e: MessageEvent) => void) {
    const handler = (e: MessageEvent) => {
      if (e.data.type === eventType) {
        callback(e);
        worker.removeEventListener('message', handler);
      }
    };
    worker.addEventListener('message', handler);
  }

  return {
    worker,
    postMessage,
    setWorkerConfig,
    listenOnce,
  };
}
