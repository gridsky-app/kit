import { ref, reactive } from 'vue'
import { ProfileModel } from "../models/ProfileModel";
import { ThreadEmbedModel } from "../models/ThreadEmbedModel";
import { ThreadReplyHandler } from "../models/ThreadReplyHandler";
import { useAgent } from "../composables/useAtproto";
import { useThreadSelection } from './useThreadSelection';
import { useOnline } from '@vueuse/core'
import {isLogged} from "@gridsky/core/runtime/utils/utilAccount"

export function useThreadModel(initialData: any | string, index?: number) {
  // reactive state
  const post = reactive<any>({})
  const feedContext = ref<any>(null)
  const replies = ref([])
  const repliesLoaded = ref(false)
  const updatedAt = ref(Date.now())
  const flags = reactive({
    mediaReady: false,
    hasBookmark: false,
    hasLike: false,
    likesLoaded: false,
    commentsLoaded: false,
    displayEssentialContent: false,
  })

  const replyHandler = new ThreadReplyHandler({ post, replies }) // o quello che serve

  // selection
  const selection = useThreadSelection()

  // chunk
  const chunk = ref({} as ThreadChunk)

  function setChunk(newChunk: ThreadChunk) {
    chunk.value = newChunk
  }

  function parseThreadPost(p: any) {
    post.cid = p.cid
    post.uri = p.uri
    post.record = p.record
    post.record.createdAt = p.record.createdAt
    post.author = new ProfileModel(p.author)

    post.likeCount = p.likeCount
    post.replyCount = p.replyCount

    post.labels = p.labels

    post.embed = null
    if (p.embed) {
      post.embed = new ThreadEmbedModel(p.embed)
    }

    post.likes = {
      list: [],
      avatars: []
    }

    if (p.viewer) {
      post.viewer = p.viewer
      flags.hasLike = !!p.viewer.like
    }
  }

  if (typeof initialData === 'string') {
    post.uri = initialData
  } else if (initialData?.post) {
    parseThreadPost(initialData.post)
    feedContext.value = initialData.feedContext
  }

  async function getThread() {
    const response = await useAgent('auto').getPostThread({ uri: post.uri })
    const data = response.data

    if (data) {
      parseThreadPost(data.thread.post)
      updateThreadReplies(data.thread.replies)
      updatedAt.value = Date.now()
    }
  }

  async function refreshThread() {
    await getThread()
  }

  async function refreshThreadInteractions() {
    const isOnline = useOnline()

    if (!isOnline.value) {
      return
    }

    const result = await useAgent('auto').getPostThread({ uri: post.uri })
    const data = result.data
    if (data?.thread) {
      post.likeCount = data.thread.post.likeCount
      post.replyCount = data.thread.post.replyCount
      updatedAt.value = Date.now()
    }
  }

  function updateThreadReplies(repliesArray: any[]) {
    replies.value = repliesArray.map(reply => useThreadModel(reply))
    repliesLoaded.value = true
  }

  function areThreadRepliesLoaded() {
    return flags.commentsLoaded
  }

  async function getThreadReplies() {
    flags.commentsLoaded = true
    await getThread()
  }

  async function resetThreadReplies() {
    replies.value = []
  }

  async function deleteThread(threadToDelete: ReturnType<typeof useThreadModel>) {
    // replies.value = replies.value.filter(reply => reply.post.uri !== threadToDelete.post.uri)
    await useAgent('private').deletePost(post.uri)
  }

  async function deleteThreadReply(threadToDelete: ReturnType<typeof useThreadModel>) {
    replies.value = replies.value.filter(reply => reply.post.uri !== threadToDelete.post.uri)
    await useAgent('private').deletePost(threadToDelete.post.uri)
    //await getThreadReplies()
  }

  function areLikesLoaded() {
    return flags.likesLoaded
  }

  const isLiked = computed(() => {
    return flags.hasLike
  })

  function setLike(value: boolean) {
    flags.hasLike = value
  }

  async function getThreadLikes(prepopulatedLikes?: any[]) {
    if (flags.likesLoaded) {
      return true
    }

    const likes = await useAgent('auto')
      .app.bsky.feed.getLikes({
        uri: post.uri,
        cid: post.cid
      })
      .then(result => {
        return result.data.likes
      })

    const likesWithAvatarsToShow = likes
      .filter(profile => !(isLogged() && !profile.actor.viewer?.following))
      .map(profile => new AuthorModel(profile.actor))

    flags.likesLoaded = true

    post.likes = {
      list: likes,
      avatars: likesWithAvatarsToShow.slice(0, 5)
    }

    return true
  }

  async function toggleLike() {
    await toggleThreadLike({
      post,
      isLiked: isLiked.value,
      setLike,
    })
  }

  const isBookmarked = computed(() => {
    return flags.hasBookmark
  })

  function setBookmark(value: boolean) {
    flags.hasBookmark = value
  }

  const layoutHorizontal = computed(() => {
    let fillImage = false
    let mediaColumnStyles: any = {}

    if (post.embed && post.embed.aspectRatio) {
      if (
        (post.embed && post.embed.aspectRatio > 0.89 && post.embed.aspectRatio < 1.55)
      ) {
        fillImage = true
      }

      if (post.embed.aspectRatio >= 1) {

        if (post.embed.aspectRatio === 1) {

          if (window.innerWidth < 1400) {
            mediaColumnStyles.width = '40vw'
          } else {
            mediaColumnStyles.width = '80vh'
            /*
            if (!props.isDialog) {
              mediaColumnStyles.width = '40vh'
            } else {
              mediaColumnStyles.width = '80vh'
            }
             */
          }
        } else {
          mediaColumnStyles.width = '50vw'
        }

        if (post.embed.aspectRatio > 1.3) {
          mediaColumnStyles.maxWidth = '100vh'
        } else {
          mediaColumnStyles.maxWidth = '80vh'
        }

      } else {

        if (post.embed.aspectRatio > 0.6) {
          mediaColumnStyles.width = '60vh'
        } else {
          mediaColumnStyles.height = '90vh'
        }

      }
    }

    return {
      mediaColumnStyles,
      fillImage,
    }
  })

  function setMediaReady() {
    flags.mediaReady = true
  }

  return {
    post,
    feedContext,
    replies,
    repliesLoaded,
    updatedAt,
    index,
    flags,
    replyHandler,
    selection,
    chunk,
    setChunk,
    getThread,
    refreshThread,
    refreshThreadInteractions,
    updateThreadReplies,
    areThreadRepliesLoaded,
    getThreadReplies,
    resetThreadReplies,
    deleteThread,
    deleteThreadReply,
    areLikesLoaded,
    isLiked,
    setLike,
    toggleLike,
    getThreadLikes,
    isBookmarked,
    setBookmark,
    layoutHorizontal,
    setMediaReady,
  }
}
