export class BaseListModel {
  public source: any

  public _list: any[] = []

  // states
  public isLoading = false
  public isRefreshing = false
  public hasReachedEnd = false

  constructor(source?: any) {
    this.source = source
  }

  /**
   * List of items, can be a list of posts, profiles, etc
   */
  public get list() {
    let sortedList = this._list;

    if (this.filterLogic) {
      sortedList = sortedList.filter(this.filterLogic)
    }

    if (this.sortLogic) {
      sortedList = sortedList.sort(this.sortLogic)
    }

    return sortedList;
  }

  /**
   * Fetch list of items, requestItems will trigger a web worker
   * that will returns a list of processed raw items (plain json)
   */
  public fetchList(restart?: boolean): void{
    this.isLoading = true

    this.requestItems(restart)
  }

  /**
   * Clear the list and reset states
   */
  public clearList() {
    this.isLoading = false
    this.hasReachedEnd = false
    this._list = []
  }

  /**
   * Clear the list and run fetch new items
   */
  public async refetchList() {
    this.isRefreshing = true
    this.fetchList(true)
  }

  // this will be always overwritten.
  // it's the recipe to fetch and process new items
  public requestItems(restart?: boolean) {}

  public prepareToAppendItems() {
    if (this.isRefreshing) {
      this._list = []
      this.isRefreshing = false
    }
  }

  // this can be overwritten if items should be instanced.
  // append items that have been fetched and processed
  public async appendItems(data: { hasReachedEnd: boolean, items: any[] }) {
    this._list.push(...data.items)

    this.isLoading = false

    if (data.hasReachedEnd) {
      this.hasReachedEnd = true
    }

    /*
    if (data.items.length === 0) {
        this.hasReachedEnd = true
    }
     */
  }

  public get isListBooting() {
    return this.isLoading && this._list.length === 0
  }

  public get isListEmpty() {
    return !this.isLoading && this._list.length === 0
  }

  public get cantLoadMoreItems() {
    return this.hasReachedEnd
  }

  // filter logic

  public filterLogic: any

  public setFilterLogic(fn: any) {
    this.filterLogic = fn
  }

  public resetFilterLogic() {
    this.filterLogic = undefined
  }

  // sort logic

  public sortLogic: any

  public setSortLogic(fn: any) {
    this.sortLogic = fn
  }
}
