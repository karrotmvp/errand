import styled from "@emotion/styled";
import { TabType } from "@type/client";
import Item from "./Item";
import { useInfiniteScroll } from "@hooks/useInfinityScroll";
import NoData from "@components/Nodata";
import { PullToRefresh } from "@karrotframe/pulltorefresh";

type ListProps = {
  tabType: TabType;
  isAppliable?: boolean;
  activeTabKey?: string;
};

export default function List({
  tabType,
  isAppliable,
  activeTabKey,
}: ListProps) {
  const {
    status,
    data,
    isFetchingFirst,
    isFetchingMore,
    fetchTriggerElement,
    refetch,
  } = useInfiniteScroll(tabType, activeTabKey ?? "", isAppliable);

  return (
    <PullToRefresh
      onPull={(dispose) => {
        refetch();
        dispose();
      }}
    >
      <ListWrapper>
        <ul>
          {status === "loading" ? (
            <li>로딩 중</li>
          ) : status === "error" ? (
            <li>에뤄</li>
          ) : data?.pages[0].length === 0 ? (
            <NoData tabType={tabType} />
          ) : (
            data?.pages?.map((group) =>
              group?.map((item) => (
                <Item {...{ item, tabType }} key={item?.errand.id} />
              ))
            )
          )}
          {!isFetchingFirst && !isFetchingMore && fetchTriggerElement}
        </ul>
      </ListWrapper>
      <div style={{ height: "2rem" }}></div>
    </PullToRefresh>
  );
}

const ListWrapper = styled.section`
  ${({ theme }) => theme.container};
`;
