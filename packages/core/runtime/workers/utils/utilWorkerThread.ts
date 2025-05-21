import {useWorkerAgentWithService} from "../utils/utilWorkerAgent";

export function workerIsValidThread(thread: any): boolean {
    if (thread.reason) {
        return false
    }

    if (thread.reply) {
        return false
    }

    const labels = thread.post.labels || []
    if (labels.some(label => ['porn', 'nudity', 'sexual', 'graphic-media'].includes(label.val))) {
        return false
    }

    const {embed} = thread.post
    if (!embed || !['app.bsky.embed.images#view', 'app.bsky.embed.video#view'].includes(embed.$type)) {
        return false
    }

    if (embed.$type === 'app.bsky.embed.images#view') {
        const firstImage = embed.images?.[0]
        if (!firstImage?.aspectRatio || firstImage.aspectRatio.width < 480 || firstImage.aspectRatio.height < 480) {
            return false
        }
    }

    return true
}

export async function workerFetchThreadLikes(rawThread: any) {
    return new Promise((resolve, reject) => {
        function makeApiCall() {
            useWorkerAgentWithService().app.bsky.feed.getLikes({
                uri: rawThread.post.uri,
                cid: rawThread.post.cid,
            })
                .then(result => {
                    resolve(result.data.likes)
                })
                .catch(error => {
                    reject(error)
                })
        }

        makeApiCall()
    })
}

export function workerGetThreadMediaUrlsToPreload(rawThread: any): string[] {
    const mediaUrls: string[] = []
    const post = rawThread.post

    // preload author avatar
    /*
    if (post.author.avatar) {
        mediaUrls.push(post.author.avatar)
    }
    */

    // Preload embed media
    if (post.embed) {
        switch (post.embed.$type) {
            case 'app.bsky.embed.images#view':
                if (Array.isArray(post.embed.images)) {
                    post.embed.images.slice(0, 2).forEach(image => {
                        mediaUrls.push(image.thumb)
                    })
                }
                break;
            case 'app.bsky.embed.video#view':
                if (post.embed.thumbnail) {
                    mediaUrls.push(post.embed.thumbnail)
                }
                break;
        }
    }

    return mediaUrls;
}
