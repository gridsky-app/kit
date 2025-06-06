import { useListFeed } from './useListFeed'

export function useListFeedNavigator(source: any) {
    const feedList = useListFeed(source)

    function importListFromOtherModel(model: FeedModel, activeIndex: number) {
      let startIndex = activeIndex - 8
      let endIndex = activeIndex + 8

      if (startIndex < 0) startIndex = 0
      if (endIndex > model.list.length) endIndex = model.list.length

      feedList.list.value = model.list.slice(startIndex, endIndex)

      const trueActiveIndex = activeIndex - startIndex

      feedList.navigation.setActiveIndex(trueActiveIndex)
    }

    return {
      ...feedList,
      importListFromOtherModel,
    }
}
