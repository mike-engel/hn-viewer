import React, { useReducer, useEffect, useRef, Dispatch, Ref, useCallback } from "react";
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
  ItemLoaded = "ITEM_LOADED",
  ChangePage = "CHANGE_PAGE"
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
      return { ...state, items: { ...state.items, loading: false } };
    case ActionType.ItemLoaded:
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
    case ActionType.ChangePage:
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
};

export const fetchItemIds = async (dispatch: Dispatch<ReducerAction>) => {
  try {
    const result = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const json = await result.json();

    dispatch({ type: ActionType.ItemListLoaded, payload: json });
  } catch (err) {
    dispatch({ type: ActionType.ItemListError, payload: err.message });
  }
};

export const fetchItem = async (id: number, dispatch: Dispatch<ReducerAction>) => {
  try {
    const fetchResult = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const itemData = await fetchResult.json();

    // React doesn't seem good at batching dispatch calls, so queue this update for the next available tick
    // This is a hack for `requestIdleCallback`, which isn't supported very well
    setTimeout(() => dispatch({ type: ActionType.ItemLoaded, payload: itemData }), 0);
  } catch (err) {
    dispatch({ type: ActionType.ItemsError, payload: err.message });
  }
};

export const fetchNewItems = async (state: State, dispatch: Dispatch<ReducerAction>) => {
  const itemsToLoad = state.itemList.data!.slice(
    (state.page - 1) * itemsPerPage,
    state.page * itemsPerPage
  );

  itemsToLoad.forEach(async item => {
    // if (!!state.items.data && Object.keys(state.items.data).length % itemsPerPage === 0) {
    //   console.log("all items loaded");

    //   dispatch({ type: ActionType.ItemsLoaded });
    // }
    fetchItem(item, dispatch);
  });
};

export const createObserver = (cb: () => void) => {
  return new IntersectionObserver(
    entries => {
      const loadMoreEntry = entries[0];

      if (!loadMoreEntry.isIntersecting) return;

      cb();
    },
    {
      root: null,
      threshold: [1.0],
      rootMargin: "0px"
    }
  );
};

export const RawNewsItems = ({ className }: Props) => {
  // Use a reducer here to guaruntee safe writes to state. `useState` overwrites the entire state,
  // and if network calls finish before the state has been updated, some items may get overwritten.
  const [state, dispatch] = useReducer(newsItemsReducer, initialState);
  const loadMoreRef = useRef(null);
  const moreToLoad =
    !!state.itemList.data &&
    Object.keys(state.items.data || {}).length !== state.itemList.data.length &&
    Object.keys(state.items.data || {}).length > 0;

  const updatePage = useCallback(() => {
    dispatch({ type: ActionType.ChangePage });
  }, []);

  // Load the initial set of items from the HN api. Returns _all_ items (500).
  useEffect(() => {
    fetchItemIds(dispatch);
  }, []);

  // itemList or the page has been updated, load new items
  useEffect(() => {
    if (!state.itemList.data || state.itemList.loading) return;

    fetchNewItems(state, dispatch);
  }, [state.itemList.data, state.page]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = createObserver(updatePage);

    observer.observe(loadMoreRef.current!);

    return () => observer.disconnect();
  }, [loadMoreRef.current]);

  if (state.itemList.loading && !state.itemList.data) {
    return <Text>Loading . . .</Text>;
  }

  if (!state.itemList.loading && (!!state.itemList.error || !state.itemList.data)) {
    return (
      <Text>{state.itemList.error || "There was a problem fetching the latest stories."}</Text>
    );
  }

  return (
    <>
      <ol className={className}>
        {state.itemList.data!.slice(0, state.page * itemsPerPage).map((item, idx) => {
          if (!state.items.data || !state.items.data[item]) {
            return <Text key={idx}>Placeholder</Text>;
          }

          const newsItem = state.items.data[item];

          return <NewsItem key={idx} {...newsItem} />;
        })}
      </ol>
      {!!moreToLoad && <Text ref={loadMoreRef}>Loading more stories . . .</Text>}
    </>
  );
};

export const NewsItems = styled(RawNewsItems)``;
