import { ref, reactive } from 'vue'
import { ProfileModel } from "../models/ProfileModel";
import { ThreadEmbedModel } from "../models/ThreadEmbedModel";
import { ThreadReplyHandler } from "../models/ThreadReplyHandler";
import { useAgent } from "../composables/useAtproto";
import { useThreadSelection } from './useThreadSelection';

export function useThreadModel(initialData: any | string, index?: number) {
  // reactive state
  const post = reactive<any>({})
  const feedContext = ref<any>(null)
  const replies = ref([])
  const repliesLoaded = ref(false)
  const updatedAt = ref(Date.now())
  const flags = reactive({
    hasLike: false,
    likesLoaded: false,
    commentsLoaded: false,
    displayEssentialContent: false
  })

  const replyHandler = new ThreadReplyHandler({ post, replies }) // o quello che serve

  // selection
  const selection = useThreadSelection()

  // chunk
  const chunk = ref({} as ThreadChunk)

  function setChunk(newChunk: ThreadChunk) {
    chunk.value = newChunk
  }

  // helper: parse post object
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

    if (p.viewer) {
      post.viewer = p.viewer
      flags.hasLike = !!p.viewer.like
    }
  }

  // inizializzazione dati
  if (typeof initialData === 'string') {
    post.uri = initialData
  } else if (initialData?.post) {
    parseThreadPost(initialData.post)
    feedContext.value = initialData.feedContext
  }

  // public API methods

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

  async function deleteThreadReply(threadToDelete: ReturnType<typeof useThreadModel>) {
    replies.value = replies.value.filter(reply => reply.post.uri !== threadToDelete.post.uri)
    await useAgent('private').deletePost(threadToDelete.post.uri)
    await getThreadReplies()
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

  async function toggleLike() {
    await toggleThreadLike({
      post,
      isLiked: isLiked.value,
      setLike,
    })
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
    deleteThreadReply,
    areLikesLoaded,
    isLiked,
    setLike,
    toggleLike,
  }
}
