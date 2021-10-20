import styled from "@emotion/styled";
import { TabType } from "@type/client";
import { ERREND_REQUEST_SIZE } from "@constant/request";
import { useErrandList } from "@api/errands";
import Item from "./Item";

type ListProps = {
  tabType: TabType;
};

export default function List({ tabType }: ListProps) {
  const { status, data: list } = useErrandList({
    lastId: 1,
    size: ERREND_REQUEST_SIZE,
  });

  return (
    <ListWrapper>
      <ul>
        {status !== "loading" ? (
          list?.map((item) => <Item {...{ item, tabType }} key={item.id} />)
        ) : (
          <li>로딩 중</li>
        )}
      </ul>
    </ListWrapper>
  );
}

const ListWrapper = styled.section`
  ${({ theme }) => theme.container};
`;
