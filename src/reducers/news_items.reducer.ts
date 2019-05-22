import { NetworkState } from "../types/network.types";
import { NewsItems, NewsItem } from "../types/hn.types";
import { ReducerAction } from "../types/component.types";

export enum NewsItemsActionType {
  ItemListLoading = "ITEM_LIST_LOADING",
  ItemListLoaded = "ITEM_LIST_LOADED",
  ItemListError = "ITEM_LIST_ERROR",
  ItemsLoading = "ITEMS_LOADING",
  ItemsLoaded = "ITEMS_LOADED",
  ItemsError = "ITEMS_ERROR",
  ItemLoaded = "ITEM_LOADED",
  ChangePage = "CHANGE_PAGE",
  ProbablyOffline = "PROBABLY_OFFLINE"
}

export type NewsItemsState = {
  itemList: NetworkState<NewsItems>;
  items: NetworkState<Record<string, NewsItem>>;
  page: number;
  offline: boolean;
};

export type NewsItemsAction = ReducerAction<NewsItemsActionType, string | NewsItems | NewsItem>;

export const itemsPerPage = 25;

export const newsItemsInitialState: NewsItemsState = {
  itemList: { loading: true, data: new Array(itemsPerPage), error: null },
  items: { loading: true, data: null, error: null },
  page: 1,
  offline: false
};

export const allItemsLoaded = (state: NewsItemsState) => {
  if (!state.items.data || !Object.keys(state.items.data).length) return false;

  return (Object.keys(state.items.data).length + 1) % itemsPerPage !== 0;
};

export const newsItemsReducer = (state: NewsItemsState, action: NewsItemsAction) => {
  switch (action.type) {
    case NewsItemsActionType.ItemListLoading:
      return { ...state, itemList: { ...state.itemList, loading: true } };
    case NewsItemsActionType.ItemListLoaded:
      return {
        ...state,
        itemList: { ...state.itemList, loading: false, data: action.payload as NewsItems }
      };
    case NewsItemsActionType.ItemListError:
      return {
        ...state,
        itemList: { ...state.itemList, loading: false, error: action.payload as string }
      };
    case NewsItemsActionType.ItemsLoading:
      return { ...state, items: { ...state.items, loading: true } };
    case NewsItemsActionType.ItemsLoaded:
      return { ...state, items: { ...state.items, loading: false } };
    case NewsItemsActionType.ItemLoaded:
      return {
        ...state,
        items: {
          ...state.items,
          loading: allItemsLoaded(state),
          data: {
            ...state.items.data,
            [(action.payload as NewsItem).id]: action.payload as NewsItem
          }
        }
      };
    case NewsItemsActionType.ItemsError:
      return { ...state, items: { ...state.items, error: action.payload as string } };
    case NewsItemsActionType.ChangePage:
      return { ...state, page: state.page + 1 };
    case NewsItemsActionType.ProbablyOffline:
      return { ...state, offline: true };
    default:
      return state;
  }
};
