import {ThreadModel} from "./ThreadModel";

export class ThreadDraftModel extends ThreadModel {
  public draft: undefined| {
    uri: string
    cid: string
  } = undefined

  constructor(data: any | string, index?: number) {
    super(data, index)

    this.draft = data.draft

    if (this.draft) {
      this.repliesLoaded = true
    }
  }
}
