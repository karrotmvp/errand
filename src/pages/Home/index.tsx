import { Check, Gear, Me, Plus } from "@assets/icon";
import CustomScreenHelmet from "@components/CustomScreenHelmet";
import styled from "@emotion/styled";
import usePush from "@hooks/usePush";
import { useNavigator } from "@karrotframe/navigator";
import { Container } from "@styles/shared";
import { getRegion } from "@utils/utils";
import { useState } from "react";
import List from "@components/List";
import CustomMixPanel from "@utils/mixpanel";

export default function Home() {
  const moveToApplyForm = usePush("/errand-request");
  const [isAppliable, setIsAppliable] = useState<boolean>(false);
  const region = getRegion();

  const toggleIsAppliable = () => {
    setIsAppliable((current) => !current);
  };

  return (
    <>
      <CustomScreenHelmet
        title={
          <Title>
            <h1>당근심부름</h1>
            <span>Beta</span>
          </Title>
        }
        appendRight={RightAppender(setIsAppliable)}
      />
      <HomeWrapper>
        <ContentWrapper>
          <Container>
            <div className="home__top">
              <div className="home__top__location">
                <h2>
                  <span>{region}</span> 주변
                </h2>
              </div>
              <div
                className={`home__top__check ${
                  isAppliable ? "primary" : "grey"
                }`}
                onClick={toggleIsAppliable}
              >
                <Check />
                <div>지원가능한 심부름 보기</div>
              </div>
            </div>
          </Container>
          <div style={{ position: "relative" }}>
            <List tabType="main" isAppliable={isAppliable} />
          </div>
        </ContentWrapper>
        <button
          className="home__fixed-fab"
          onClick={() => {
            moveToApplyForm();
            CustomMixPanel.track(CustomMixPanel.eventName.clickETC, {
              page: "홈",
              clickTarget: "요청하기",
            });
          }}
        >
          <Plus stroke="white" />
        </button>
      </HomeWrapper>
    </>
  );
}

export const Title = styled.div`
  display: flex;
  align-items: flex-end;

  & > span {
    color: ${({ theme }) => theme.color.primary};
    font-size: 1.2rem;
    font-weight: 500;
    margin-left: 0.5rem;
  }
`;

const HomeWrapper = styled.main`
  height: 100%;
  position: relative;
  .home {
    &__top {
      margin-top: 2rem;

      display: flex;
      justify-content: space-between;
      align-items: center;

      &__location {
        font-size: 1.7rem;
        font-weight: 700;

        display: flex;
        align-items: center;
        & > h2 {
          font-family: Cafe24Ssurround;
          & > span {
            color: ${({ theme }) => theme.color.primary};
          }
        }
      }
      &__check {
        display: flex;
        align-items: center;
        & > div {
          margin-left: 0.5rem;
          ${({ theme }) => theme.font("small", "medium")};
          margin-bottom: 0.3rem;
        }
        &.primary {
          color: ${({ theme }) => theme.color.primary};
          & > svg {
            fill: ${({ theme }) => theme.color.primary};
            stroke: white;
          }
        }
        &.grey {
          color: ${({ theme }) => theme.color.grey4};
          & > svg {
            fill: ${({ theme }) => theme.color.grey8};
            stroke: ${({ theme }) => theme.color.grey6};
          }
        }
      }
    }
    &__container {
      ${({ theme }) => theme.container}
    }
    &__fixed-fab {
      position: absolute;
      bottom: 4rem;
      right: 3rem;

      width: 5.7rem;
      height: 5.7rem;
      background: ${({ theme }) => theme.color.primary};
      border-radius: 3rem;

      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
  }
`;
const ContentWrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
`;

export const RightAppender = (
  setIsAppliable: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { push } = useNavigator();
  const moveToAlarm = usePush("/alarm");

  const moveToMy = async () => {
    const data = await push<{ isAppliable: boolean }>("/my");
    data && setIsAppliable(data.isAppliable);
  };

  return (
    <AppenderWrapper>
      <div onClick={moveToMy}>
        <Me />
      </div>
      <div onClick={moveToAlarm}>
        <Gear />
      </div>
    </AppenderWrapper>
  );
};

export const AppenderWrapper = styled.div`
  display: flex;

  & > div {
    display: flex;
    align-items: center;
  }
  & > div + div {
    margin-left: 1.8rem;
  }
`;
