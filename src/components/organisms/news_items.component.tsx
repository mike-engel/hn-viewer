import React, { useReducer, useEffect } from "react";
import styled from "styled-components";
import { Stylable, ReducerAction } from "../../types/component.types";
import { NewsItems as NewsItemsShape, NewsItem as NewsItemShape } from "../../types/hn.types";
import { NetworkState } from "../../types/network.types";
import { NewsItem } from "../molecules/news_item.component";
import { Text } from "../atoms/typography.component";

type Props = Stylable;

enum ActionType {
  ItemListLoading = "ITEM_LIST_LOADING",
  ItemListLoaded = "ITEM_LIST_LOADED",
  ItemListError = "ITEM_LIST_ERROR",
  ItemsLoading = "ITEMS_LOADING",
  ItemsLoaded = "ITEMS_LOADED",
  ItemsError = "ITEMS_ERROR",
  NextPageLoading = "NEXT_PAGE_LOADING",
  NextPageLoaded = "NEXT_PAGE_LOADED",
  NextPageError = "NEXT_PAGE_ERROR"
}

type State = {
  itemList: NetworkState<NewsItemsShape>;
  items: NetworkState<Record<string, NewsItemShape>>;
  page: number;
};

type Action = ReducerAction<ActionType, string | NewsItemsShape | NewsItemShape>;

const itemsPerPage = 25;

const initialState: State = {
  itemList: { loading: true, data: null, error: null },
  items: { loading: true, data: null, error: null },
  page: 1
};

const newsItemsReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.ItemListLoading:
      return { ...state, itemList: { ...state.itemList, loading: true } };
    case ActionType.ItemListLoaded:
      return {
        ...state,
        itemList: { ...state.itemList, loading: false, data: action.payload as NewsItemsShape }
      };
    case ActionType.ItemListError:
      return {
        ...state,
        itemList: { ...state.itemList, loading: false, error: action.payload as string }
      };
    case ActionType.ItemsLoading:
      return { ...state, items: { ...state.items, loading: true } };
    case ActionType.ItemsLoaded:
      return {
        ...state,
        items: {
          ...state.items,
          data: {
            ...state.items.data,
            [(action.payload as NewsItemShape).id]: action.payload as NewsItemShape
          }
        }
      };
    case ActionType.ItemsError:
      return { ...state, items: { ...state.items, error: action.payload as string } };
    default:
      return state;
  }
};

export const RawNewsItems = ({ className }: Props) => {
  // Use a reducer here to guaruntee safe writes to state. `useState` overwrites the entire state,
  // and if network calls finish before the state has been updated, some items may get overwritten.
  const [state, dispatch] = useReducer(newsItemsReducer, initialState);

  // Load the initial set of items from the HN api. Returns _all_ items (500).
  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then(data => data.json())
      .then(data => {
        dispatch({ type: ActionType.ItemListLoaded, payload: data });
      })
      .catch(err => {
        dispatch({ type: ActionType.ItemListError, payload: err.message });
      });
  }, []);

  // itemList has been updated, load new items
  useEffect(() => {
    if (!state.itemList.data || state.itemList.loading) return;

    const itemsToLoad = state.itemList.data.slice(
      (state.page - 1) * itemsPerPage,
      state.page * itemsPerPage
    );

    itemsToLoad.forEach(async item => {
      try {
        const fetchResult = await fetch(`https://hacker-news.firebaseio.com/v0/item/${item}.json`);
        const itemData = await fetchResult.json();

        dispatch({ type: ActionType.ItemsLoaded, payload: itemData });
      } catch (err) {
        dispatch({ type: ActionType.ItemsError, payload: err.message });
      }
    });
  }, [state.itemList.data]);

  if (state.itemList.loading && !state.itemList.data) {
    return <Text>Loading . . .</Text>;
  }

  if (!state.itemList.loading && (!!state.itemList.error || !state.itemList.data)) {
    return (
      <Text>{state.itemList.error || "There was a problem fetching the latest stories."}</Text>
    );
  }

  return (
    <ol className={className}>
      {state.itemList.data!.slice(0, state.page * itemsPerPage).map(item => {
        if (!state.items.data || !state.items.data[item]) {
          return <Text>Placeholder</Text>;
        }

        const newsItem = state.items.data[item];

        return <NewsItem key={newsItem.title} {...newsItem} />;
      })}
    </ol>
  );
};

export const NewsItems = styled(RawNewsItems)``;
