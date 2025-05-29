export class ThreadEmbedImageModel {
    public id: string
    public alt: string
    public thumb: string
    public aspectRatioRaw: undefined | {width: number, height: number}

    public blob: Blob
    public upload = ref<undefined | { isUploading: false, isUploaded: false, progress: 0 }>(undefined)

    constructor(media) {
        this.id = media.id
        this.alt = media.alt
        this.thumb = media.thumb
        this.aspectRatioRaw = media.aspectRatio

        if (media.blob) {
            this.blob = media.blob
        }

        if (media.upload) {
            this.upload = media.upload
        }
    }

    get aspectRatio() {
        if (!this.aspectRatioRaw) {
            return 1
        }

        return this.aspectRatioRaw.width / this.aspectRatioRaw.height
    }
}
