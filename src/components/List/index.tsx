import { TabType } from "@type/client";
import Item from "./Item";
import { useInfiniteScroll } from "@hooks/useInfinityScroll";
import NoData from "@components/Nodata";
import { PullToRefresh } from "@karrotframe/pulltorefresh";
import { ERREND_REQUEST_SIZE } from "@constant/request";
import CustomMixPanel from "@utils/mixpanel";
import { Container } from "@styles/shared";

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
        CustomMixPanel.track(CustomMixPanel.eventName.refresh, { tabType });
        refetch().then(() => {
          dispose();
        });
      }}
    >
      <Container>
        <ul style={{ minHeight: "100%" }}>
          {status === "loading" ? (
            // TODO Loading..
            <li></li>
          ) : status === "error" ? (
            // TODO Error..
            <li></li>
          ) : data?.pages[0].length === 0 ? (
            <NoData tabType={tabType} />
          ) : (
            data?.pages?.map((group) =>
              group?.map((item, index, array) => (
                <>
                  {index === array.length - ERREND_REQUEST_SIZE / 2 &&
                    !isFetchingFirst &&
                    !isFetchingMore &&
                    fetchTriggerElement}
                  <Item {...{ item, tabType }} key={item?.errand.id} />
                </>
              ))
            )
          )}
        </ul>
        <div style={{ height: "2rem" }}></div>
      </Container>
    </PullToRefresh>
  );
}
