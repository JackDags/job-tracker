import { AppShell, AppShellFooter, AppShellHeader, AppShellMain, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import JobFooter from "./components/JobFooter";
import JobHeader from "./components/JobHeader";
import Jobs from "./pages/Jobs";
import { theme } from "./theme";
import '@mantine/dates/styles.css';

export default function App() {
  return (
    <MantineProvider theme={theme}>

      <AppShell
        padding={"md"}
        header={{ height: 60 }}
      >
        <AppShellHeader>
          <JobHeader />
        </AppShellHeader>
        <AppShellMain>
          <Jobs />
        </AppShellMain>
        <AppShellFooter>
          <JobFooter />
        </AppShellFooter>
      </AppShell>
    </MantineProvider>
  )
}
