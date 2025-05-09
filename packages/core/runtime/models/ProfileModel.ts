export class ProfileModel {
    public avatar: string
    public createdAt: string
    public did: string
    public displayName: string
    public handle: string
    public viewer: any

    constructor(author: any) {
        this.avatar = author.avatar
        this.createdAt = author.createdAt
        this.did = author.did
        this.displayName = author.displayName
        this.handle = author.handle

        if (author.viewer) {
            this.viewer = author.viewer
        }

        return this
    }
}
