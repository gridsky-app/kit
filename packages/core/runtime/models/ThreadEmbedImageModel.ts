export class ThreadEmbedImageModel {
    public alt: string
    public thumb: string
    public aspectRatioRaw: undefined | {width: number, height: number}

    constructor(image) {
        this.alt = image.alt
        this.thumb = image.thumb
        this.aspectRatioRaw = image.aspectRatio
    }

    get aspectRatio() {
        if (!this.aspectRatioRaw) {
            return 1
        }

        return this.aspectRatioRaw.width / this.aspectRatioRaw.height
    }
}
