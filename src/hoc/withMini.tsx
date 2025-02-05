import { reqeustLogin } from "@api/etc";
import envs from "@config/dotenv";
import mini from "@lib/mini";
import { isLoginAtom } from "../store/user";
import { getValueFromSearch } from "@utils/utils";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Sample } from "@assets/images";
import CustomScreenHelmet from "@components/CustomScreenHelmet";
import { AppenderWrapper, Title } from "@pages/Home";
import { Gear, Loader, Me } from "@assets/icon";
import CustomMixPanel from "@utils/mixpanel";

export default function withMini(Component: React.ElementType) {
  return (props: any) => {
    const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);
    const [isClosed, setIsClosed] = useState<boolean>(false);
    const [isSigned, setIsSigned] = useState<boolean>(() => {
      const codeParams = getValueFromSearch("code");
      return Boolean(codeParams);
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const login = useCallback(
      async (code: string, regionId: string, isFirst: boolean = false) => {
        try {
          setIsLoading(true);
          const res = await reqeustLogin(code, regionId);
          setIsLogin(res === "OK");
          if (res === "OK" && isFirst) {
            CustomMixPanel.track(CustomMixPanel.eventName.firstLogin);
          }
        } catch {
          throw new Error("login error");
        } finally {
          setIsLoading(false);
        }
      },
      [setIsLogin]
    );

    const askAgreement = useCallback(() => {
      const codeParams = getValueFromSearch("code");
      const regionId = getValueFromSearch("region_id");
      const preload = getValueFromSearch("preload");

      if (preload !== "true" && !codeParams && regionId) {
        console.log("mini start preset!!");
        mini.startPreset({
          preset: envs.MINI_PRESET_URL || "",
          params: { appId: envs.APP_ID || "" },
          onSuccess(result: { code: string }) {
            if (result && result.code) {
              setIsSigned(true);
              login(result.code, regionId, true);
            }
          },
          onClose() {
            setIsClosed(true);
          },
        });
      } else {
        console.log(
          `preload : ${preload}, codeParams : ${codeParams}, regionId : ${regionId} 중 하나가 비정상!`
        );
      }
    }, [login]);

    useEffect(() => {
      if (isClosed && !isSigned) {
        mini.close();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isClosed, isLogin]);

    useEffect(() => {
      if (isLogin) {
        return;
      }
      const result = checkAgreedUser();
      if (result) {
        login(result.codeParams, result.regionId);
        return;
      }
      askAgreement();
    }, [isLogin, askAgreement, login]);

    if (!isLogin) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomScreenHelmet
            title={
              <Title>
                <h1>당근심부름</h1>
                <span>Beta</span>
              </Title>
            }
            appendRight={
              <AppenderWrapper>
                <div>
                  <Me />
                </div>
                <div>
                  <Gear />
                </div>
              </AppenderWrapper>
            }
          />
          {isLoading ? (
            <Loader width={70} height={70} fill="#FF7E36" />
          ) : (
            <>
              <img style={{ width: "100%" }} src={Sample} alt="sample" />
            </>
          )}
        </div>
      );
    }

    return <Component {...props} />;
  };
}

const checkAgreedUser = () => {
  const codeParams = getValueFromSearch("code");
  const regionId = getValueFromSearch("region_id");
  if (codeParams && regionId) {
    return { codeParams, regionId };
  }
  return false;
};
