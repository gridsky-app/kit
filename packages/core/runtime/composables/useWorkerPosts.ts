const workerPosts = new Worker(
    new URL('../workers/workerPosts.ts', import.meta.url),
    {type: 'module'}
)

export function useWorkerPosts() {
    return workerPosts
}
