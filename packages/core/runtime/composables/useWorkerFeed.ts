const workerFeed = new Worker(
    new URL('../workers/workerFeed.ts', import.meta.url),
    {type: 'module'}
)

export function useWorkerFeed() {
    return workerFeed
}
