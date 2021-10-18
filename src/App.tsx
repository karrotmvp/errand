import { ThemeProvider } from "@emotion/react";
import { Navigator, Screen } from "@karrotframe/navigator";
import { GlobalStyle } from "./styles/global-style";
import { theme } from "./styles/theme";
import { initMSW } from "./lib/msw";
import { useEffect } from "react";
import envs from "./config/dotenv";
import mini from "./lib/mini";
import styled from "@emotion/styled";
import {
  Alarm,
  ApplyForm,
  ApplierList,
  ErrandDetail,
  ErrandRequest,
  Home,
  My,
  Resume,
  User,
} from "./pages";

initMSW();

function App() {
  useEffect(() => {
    mini.startPreset({
      preset: envs.PRESET,
      params: {
        appId: envs.APP_ID,
      },
      onSuccess: function (result) {
        if (result && result.code) {
          console.log(result.code);
        }
      },
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Test />
      <Navigator
        theme="Cupertino"
        onClose={() => {
          console.log("close. bye~");
        }}
      >
        <Screen path="/" component={Home} />
        <Screen path="/applier-list" component={ApplierList} />
        <Screen path="/apply-form/" component={ApplyForm} />
        <Screen path="/resume" component={Resume} />
        <Screen path="/alarm" component={Alarm} />
        <Screen path="/errands/:id" component={ErrandDetail} />
        <Screen path="/users/:userId" component={ErrandRequest} />
        <Screen path="/My" component={My} />
        <Screen path="/users/:id" component={User} />
      </Navigator>
    </ThemeProvider>
  );
}

const Test = styled.div`
  background: ${({ theme }) => theme.color.primary};
`;

export default App;
