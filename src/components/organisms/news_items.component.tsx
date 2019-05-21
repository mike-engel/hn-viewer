import React, { useReducer, useEffect, useRef, Dispatch, useCallback } from "react";
import styled from "styled-components";
import { Stylable, ReducerAction } from "../../types/component.types";
import { NewsItem } from "../molecules/news_item.component";
import { Text, fontSize } from "../atoms/typography.component";
import {
  NewsItemsActionType,
  NewsItemsState,
  newsItemsReducer,
  newsItemsInitialState
} from "../../reducers/news_items.reducer";
import { StoryPlaceholder } from "../atoms/story_placeholder.component";
import { spacing } from "../../utils/spacing.utils";
import { darkGrey } from "../atoms/color.component";

type Props = Stylable;

const itemsPerPage = 25;

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
    dispatch({ type: NewsItemsActionType.ItemsError, payload: err.message });
  }
};

export const fetchNewItems = async (state: NewsItemsState, dispatch: Dispatch<ReducerAction>) => {
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
  const [state, dispatch] = useReducer(newsItemsReducer, newsItemsInitialState);
  const loadMoreRef = useRef(null);
  const moreToLoad =
    !!state.itemList.data &&
    Object.keys(state.items.data || {}).length !== state.itemList.data.length &&
    Object.keys(state.items.data || {}).length > 0;

  const updatePage = useCallback(() => {
    dispatch({ type: NewsItemsActionType.ChangePage });
  }, []);

  useEffect(() => {
    fetchItemIds(dispatch);
  }, []);

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

  return (
    <section className={className}>
      <Choose>
        <When condition={state.itemList.loading && !state.itemList.data}>
          <Text>Loading . . .</Text>
        </When>
        <When
          condition={!state.itemList.loading && (!!state.itemList.error || !state.itemList.data)}
        >
          <Text>{state.itemList.error || "There was a problem fetching the latest stories."}</Text>
        </When>
        <Otherwise>
          <ol aria-live="polite">
            {state.itemList.data!.slice(0, state.page * itemsPerPage).map((item, idx) => {
              if (!state.items.data || !state.items.data[item]) {
                return <StoryPlaceholder key={idx} />;
              }

              const newsItem = state.items.data[item];

              return <NewsItem key={idx} {...newsItem} />;
            })}
          </ol>
          {!!moreToLoad && <Text ref={loadMoreRef}>Loading more stories . . .</Text>}
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

  li:before {
    content: counter(li);
    counter-increment: li;
    position: absolute;
    top: ${spacing(0.25)}px;
    left: -${spacing(3)}px;
    color: ${darkGrey};
    font-size: ${fontSize.level4};
  }
`;
