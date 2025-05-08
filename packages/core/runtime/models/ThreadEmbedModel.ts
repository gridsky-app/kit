import {ThreadEmbedImageModel} from "./ThreadEmbedImageModel";
import {useThreadEmbedVideo} from "../composables/useThreadEmbedVideo";

export class ThreadEmbedModel {
    public $type: string

    public images: any[] = []
    public video: any
    public aspectRatioRaw: any

    constructor(embed: any) {
        // handle this $type /gridsky.app/p/3livnv2oock2p
        // should probably be refactored
        if (embed.$type === 'app.bsky.embed.record#view') {
            if (embed.record && embed.record.embeds && Array.isArray(embed.record.embeds)) {
                if (embed.record.embeds.length > 0) {
                    embed = embed.record.embeds[0]
                }
            }
        }

        this.$type = embed.$type

        switch (this.$type) {
            case 'app.bsky.embed.images#view':
                if (Array.isArray(embed.images) && embed.images.length > 0) {
                    this.aspectRatioRaw = embed.images[0].aspectRatio

                    for (let image of embed.images) {
                        this.images.push(new ThreadEmbedImageModel(image))
                    }
                }
                break
            case 'app.bsky.embed.video#view':
                this.aspectRatioRaw = embed.aspectRatio

                if (embed.playlist) {
                    this.video = useThreadEmbedVideo(embed)
                }
                break
        }
    }

  /**
   * Calculates and returns the aspect ratio based on the stored width and height values.
   * If the necessary properties are missing, invalid, or incorrect, the method returns a default value of 1
   */
  get aspectRatio() {
        if (
            !this.$type
            || !this.aspectRatioRaw
            || !this.aspectRatioRaw.width
            || !this.aspectRatioRaw.height
            || !Number.isInteger(this.aspectRatioRaw.width)
            || !Number.isInteger(this.aspectRatioRaw.height)
        ) {
            return 1
        }

        return this.aspectRatioRaw.width / this.aspectRatioRaw.height
    }

    get type() {
        switch (this.$type) {
            case 'app.bsky.embed.images#view':
                if (this.images && this.images.length > 1) {
                    return 'album'
                }

                return 'image'
            case 'app.bsky.embed.video#view':
                return 'video'
            default:
                return 'text'
        }
    }
}
