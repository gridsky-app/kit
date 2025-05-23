import {ref, reactive} from 'vue'
import {ProfileModel} from "./ProfileModel";
import {ThreadEmbedModel} from "./ThreadEmbedModel";
import {ThreadReplyHandler} from "./ThreadReplyHandler";
import {useAgent} from "../composables/useAgent";

export class ThreadModel {
  public post = {}
  public feedContext

  public replies = ref<ThreadModel[]>([])
  public repliesLoaded = false

  public updatedAt = Date.now()

  public index = -1

  public flags = reactive({
    hasLike: false,
    likesLoaded: false,
    commentsLoaded: false,

    displayEssentialContent: false
  })

  public replyHandler: ThreadReplyHandler;

  constructor(data: any | string, index?: number) {
    this.replyHandler = new ThreadReplyHandler(this)

    // sometimes could be useful to have a dummy load.
    // thread will be populated/updated later
    if (typeof data === 'string') {
      this.post = {
        uri: data
      }

      return
    }

    this.parseThreadPost(data.post)

    this.feedContext = data.feedContext

    this.index = index

    // this.getThreadLikes(data.likes)
  }

  /**
   * Parses a thread post object and populates the properties of the current post instance
   *
   * @param {any} post
   * @return {void}
   */
  private parseThreadPost(post: any) {
    this.post.cid = post.cid
    this.post.uri = post.uri
    this.post.record = post.record
    this.post.record.createdAt = post.record.createdAt
    this.post.author = new ProfileModel(post.author)

    this.post.likeCount = post.likeCount
    this.post.replyCount = post.replyCount

    this.post.labels = post.labels

    this.post.embed = null

    if (post.embed) {
      this.post.embed = new ThreadEmbedModel(post.embed)
    }

    if (post.viewer) {
      this.post.viewer = post.viewer

      this.flags.hasLike = !!post.viewer.like
    }
  }

  /**
   * Fetches and processes a thread for a specific post by making an API request.
   * The thread's posts and replies are parsed and handled accordingly
   */
  public async getThread() {
    await useAgent('auto')
      .getPostThread({
        uri: this.post.uri,
      })
      .then(response => response.data)
      .then(data => {
        const thread: BskyThread = data.thread

        if (data) {
          this.parseThreadPost(thread.post)
          this.updateThreadReplies(thread.replies)
        }

        this.updatedAt = Date.now()
      })
  }

  /**
   * Refreshes the current thread by fetching the latest thread data
   */
  public async refreshThread() {
    await this.getThread()
  }

  /**
   * Refreshes the interactions of the current post thread
   * by fetching updated data such as like count and reply count
   */
  public async refreshThreadInteractions() {
    await useAgent('auto')
      .getPostThread({
        uri: this.post.uri,
      })
      .then(result => result.data)
      .then(data => {
        const thread: BskyThread = data.thread

        if (thread) {
          this.post.likeCount = thread.post.likeCount
          this.post.replyCount = thread.post.replyCount
        }
      })

    this.updatedAt = Date.now()
  }

  // comments

  /**
   * Updates the list of thread replies by transforming the input replies
   * into instances of the ThreadModel and sets them to the replies property
   */
  private updateThreadReplies(replies: BskyThread[]) {
    const repliesTemp = []

    for (const reply of replies) {
      repliesTemp.push(new ThreadModel(reply))
    }

    this.replies.value = repliesTemp
    this.repliesLoaded = true
  }

  /**
   * Checks if the thread replies have been loaded.
   *
   * @return {boolean}
   */
  get areThreadRepliesLoaded() {
    return this.flags.commentsLoaded
  }

  /**
   * Fetches replies for a thread and sets a flag indicating that the comments have been loaded
   */
  public async getThreadReplies() {
    this.flags.commentsLoaded = true

    await this.getThread()
  }

  /**
   * Resets the thread replies by clearing all values
   */
  public async resetThreadReplies() {
    this.replies.value = []
  }

  /**
   * Deletes a specific reply from a thread and updates the thread replies
   */
  public async deleteThreadReply(thread: ThreadModel) {
    this.replies.value = this.replies.value.filter(reply => {
      return reply.post.uri !== thread.post.uri
    })

    await useAgent('private').deletePost(thread.post.uri)

    await this.getThreadReplies()
  }

  // likes

  /**
   * Checks whether the "likes" data has been loaded
   *
   * @return {boolean}
   */
  get areLikesLoaded(): boolean {
    return this.flags.likesLoaded
  }

  /**
   * Determines if the current item is liked based on internal flags
   *
   * @return {boolean}
   */
  get isLiked(): boolean {
    return this.flags.hasLike
  }

  /**
   * Sets the "like" status for the current thread
   */
  public setLike(value: boolean) {
    this.flags.hasLike = value
  }


  // selection for profile grids customization

  public selection: any = useThreadSelection()

  // chunks for the gridsky main app

  public chunk: ThreadChunk = {} as ThreadChunk

  public setChunk(chunk: ThreadChunk) {
    this.chunk = chunk
  }
}
