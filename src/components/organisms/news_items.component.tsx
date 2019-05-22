import React, {
  useReducer,
  useEffect,
  useRef,
  Dispatch,
  useCallback,
  MutableRefObject
} from "react";
import styled from "styled-components";
import { Stylable, ReducerAction } from "../../types/component.types";
import { NewsItem } from "../molecules/news_item.component";
import { Text, fontSize } from "../atoms/typography.component";
import {
  NewsItemsActionType,
  NewsItemsState,
  newsItemsReducer,
  newsItemsInitialState,
  itemsPerPage
} from "../../reducers/news_items.reducer";
import { StoryPlaceholder } from "../atoms/story_placeholder.component";
import { spacing } from "../../utils/spacing.utils";
import { darkGrey, lightGrey } from "../atoms/color.component";

type Props = Stylable;

export const fetchItemIds = async (dispatch: Dispatch<ReducerAction>) => {
  try {
    const result = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const json = await result.json();

    dispatch({ type: NewsItemsActionType.ItemListLoaded, payload: json });
  } catch (err) {
    dispatch({ type: NewsItemsActionType.ItemListError, payload: err.message });
  }
};

export const fetchItem = async (id: number, dispatch: Dispatch<ReducerAction>) => {
  try {
    const fetchResult = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const itemData = await fetchResult.json();

    // React doesn't seem good at batching dispatch calls, so queue this update for the next available tick
    // This is a hack for `requestIdleCallback`, which isn't supported very well
    setTimeout(() => dispatch({ type: NewsItemsActionType.ItemLoaded, payload: itemData }), 0);
  } catch (err) {
    // console.log("error fetching item", err);
    if (/failed to fetch/i.test(err.message)) {
      dispatch({ type: NewsItemsActionType.ProbablyOffline });

      return;
    }

    dispatch({ type: NewsItemsActionType.ItemsError, payload: err.message });
  }
};

export const fetchNewItems = async (state: NewsItemsState, dispatch: Dispatch<ReducerAction>) => {
  const itemsToLoad = state.itemList.data!.slice(
    (state.page - 1) * itemsPerPage,
    state.page * itemsPerPage
  );

  itemsToLoad.forEach(async item => fetchItem(item, dispatch));
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

export const moreItemsAvailable = (state: NewsItemsState) => {
  if (!state.items.data || !state.itemList.data) return true;

  return Object.keys(state.items.data).length < state.itemList.data.length;
};

export const RawNewsItems = ({ className }: Props) => {
  // Use a reducer here to guaruntee safe writes to state. `useState` overwrites the entire state,
  // and if network calls finish before the state has been updated, some items may get overwritten.
  const [state, dispatch] = useReducer(newsItemsReducer, newsItemsInitialState);
  const loadMoreRef = useRef(null);
  const canLoadMore = moreItemsAvailable(state) && !state.items.loading;
  const observer: MutableRefObject<IntersectionObserver | null> = useRef(null);
  // If the use is probably offline, don't show the previews
  const storyCount = (state.offline ? state.page - 1 : state.page) * itemsPerPage;

  // performance enhancement. It may not make a big difference, but it doesn't hurt to include.
  const updatePage = useCallback(() => {
    dispatch({ type: NewsItemsActionType.ChangePage });
  }, []);

  useEffect(() => {
    observer.current = createObserver(updatePage);
    fetchItemIds(dispatch);
  }, []);

  useEffect(() => {
    if (!state.itemList.data || state.itemList.loading) return;

    dispatch({ type: NewsItemsActionType.ItemsLoading });

    fetchNewItems(state, dispatch);
  }, [state.itemList.data, state.page]);

  useEffect(() => {
    if (!loadMoreRef.current || !canLoadMore || !observer.current) return;

    observer.current.observe(loadMoreRef.current!);

    return () => {
      if (!observer.current) return;

      observer.current.disconnect();
    };
  }, [loadMoreRef.current, canLoadMore]);

  return (
    <section className={className}>
      <Choose>
        <When
          condition={!state.itemList.loading && (!!state.itemList.error || !state.itemList.data)}
        >
          <Text>{state.itemList.error || "There was a problem fetching the latest stories."}</Text>
        </When>
        <Otherwise>
          <ol aria-live="polite">
            {state.itemList.data!.slice(0, storyCount).map((item, idx) => {
              if (!state.items.data || !state.items.data[item]) {
                return <StoryPlaceholder key={idx} />;
              }

              const newsItem = state.items.data[item];

              return <NewsItem key={idx} {...newsItem} />;
            })}
          </ol>
          <If condition={state.offline}>
            <Text>
              Looks like you're offline. You'll be able to load more stories once you're back
              online.
            </Text>
          </If>
          <Text ref={loadMoreRef}>
            <If condition={canLoadMore}>Loading more stories . . .</If>
          </Text>
        </Otherwise>
      </Choose>
    </section>
  );
};

export const NewsItems = styled(RawNewsItems)`
  ol {
    margin: 0 0 0 ${spacing(3)}px;
    padding: 0;
    list-style: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E");
    counter-reset: li;
  }

  li {
    position: relative;
  }

  li + li {
    margin-top: ${spacing(2)}px;
  }

  li:before {
    content: counter(li);
    counter-increment: li;
    position: absolute;
    top: ${spacing(0.25)}px;
    left: -${spacing(3)}px;
    color: ${darkGrey};
    font-size: ${fontSize.level4};
  }

  ol + ${Text} {
    padding: ${spacing(2)}px 0;
    margin-top: ${spacing(4)}px;
    border-top: 1px solid ${lightGrey};
    text-align: center;
  }
`;
