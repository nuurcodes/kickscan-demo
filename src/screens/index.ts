import { ModalScreenLayouts, ScreenLayouts, TabScreenLayouts } from '@services/navigation/types';

import { Main } from '@screens/main';
import { Settings } from '@screens/settings';
import { Example } from '@screens/example';
import { genRootNavigator, genStackNavigator, genTabNavigator } from '@services/navigation/help';
import { screenDefaultOptions, tabBarDefaultOptions } from '@services/navigation/options';
import { Login } from '@screens/auth/Login';
import { Register } from '@screens/auth/Register';
import { ResetPassword } from '@screens/auth/ResetPassword';
import { Scan } from '@screens/scan';

// TODO: Remove scan tracking modal
export type Tabs = 'Main' | 'WIP' | 'Settings';
export type Modal = 'ScanModal' | 'ExampleModal';
export type Screen =
  | 'Main'
  | 'Example'
  | 'Settings'
  | 'Login'
  | 'Register'
  | 'ResetPassword'
  | 'Scan';

export type ModalProps = {
  ScanModal: undefined;
  ExampleModal: undefined;
};
export type ScreenProps = {
  Main: undefined;
  Example: undefined;
  Settings: undefined;
} & ModalProps;

// Screens
const screens: ScreenLayouts = {
  Main: {
    name: 'Main',
    component: Main,
    options: () => ({
      title: 'Home',
      ...screenDefaultOptions(),
    }),
  },
  Example: {
    name: 'Example',
    component: Example,
    options: () => ({
      title: 'Example',
      ...screenDefaultOptions(),
    }),
  },
  Settings: {
    name: 'Settings',
    component: Settings,
    options: () => ({
      title: 'Settings',
      ...screenDefaultOptions(),
    }),
  },
  Login: {
    name: 'Login',
    component: Login,
    options: () => ({
      title: 'Login',
      ...screenDefaultOptions(),
    }),
  },
  Register: {
    name: 'Register',
    component: Register,
    options: () => ({
      title: 'Register',
      ...screenDefaultOptions(),
    }),
  },
  ResetPassword: {
    name: 'ResetPassword',
    component: ResetPassword,
    options: () => ({
      title: 'Reset Password',
      ...screenDefaultOptions(),
    }),
  },
  Scan: {
    name: 'Scan',
    component: Scan,
    options: () => ({
      title: 'Scan',
      headerShown: false,
    }),
  },
};

const HomeStack = () => genStackNavigator([screens.Main, screens.Example]);
const ExampleStack = () => genStackNavigator([screens.Example]);
const SettingsStack = () => genStackNavigator([screens.Settings]);
const ExampleModalStack = () => genStackNavigator([screens.Main]);
const ScanModalStack = () => genStackNavigator([screens.Scan]);
const AuthStack = () => genStackNavigator([screens.Login, screens.Register, screens.ResetPassword]);

// Tabs
const tabs: TabScreenLayouts = {
  Main: {
    name: 'MainNavigator',
    component: HomeStack,
    options: () => ({
      title: 'Home',
      ...tabBarDefaultOptions('MainNavigator'),
    }),
  },
  WIP: {
    name: 'ExampleNavigator',
    component: ExampleStack,
    options: () => ({
      title: 'WIP',
      ...tabBarDefaultOptions('ExampleNavigator'),
    }),
  },
  Settings: {
    name: 'SettingsNavigator',
    component: SettingsStack,
    options: () => ({
      title: 'Settings',
      ...tabBarDefaultOptions('SettingsNavigator'),
    }),
  },
};
const TabNavigator = () => genTabNavigator([tabs.Main, tabs.WIP, tabs.Settings]);

// Modals
const modals: ModalScreenLayouts = {
  ExampleModal: {
    name: 'ExampleModal',
    component: ExampleModalStack,
    options: () => ({
      title: 'ExampleModal',
    }),
  },
  ScanModal: {
    name: 'ScanModal',
    component: ScanModalStack,
    options: () => ({
      title: 'ScanModal',
    }),
  },
};

// Root Navigator
export const RootNavigator = (): JSX.Element =>
  genRootNavigator(TabNavigator, [modals.ExampleModal], [modals.ScanModal]);

// Auth Navigator
export const AuthNavigator = (): JSX.Element => AuthStack();
