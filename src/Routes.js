import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import {
  Main as MainLayout,
  Minimal as MinimalLayout,
  Empty as EmptyLayout
} from './layouts';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  MembersReport as MembersReportView,
  CentersList as CentersListView,
  RegisterAbalat as RegisterAbalatView,
  RegisterMaekel as RegisterMaekelView,
  RegisterKifil as RegisterKifilView,
  RegisterSubKifil as RegisterSubKifilView,
  AssignGeneralManager as AssignGeneralManagerView,
  AssignAssistanceGeneralManager,
  SignOut as SignOutView,
  AbalatList as AbalatListView,
  GeneralManagerList as GeneralManagerListView,
  MaekelManagerList as MaekelManagerListView,
  KifilManagerList as KifilManagerListView,
  MaekelList as MaekelListView,
  AbalatReport as AbalatReportView,
  EditAbalatInfo as EditAbalatInfoView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/sign-in" />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MainLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={EmptyLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      {/* custom */}
      <RouteWithLayout
        component={AbalatListView}
        exact
        layout={MainLayout}
        path="/abalat"
      />
      <RouteWithLayout
        component={MembersReportView}
        exact
        layout={MainLayout}
        path="/members-report"
      />
      <RouteWithLayout
        component={CentersListView}
        exact
        layout={MainLayout}
        path="/centers"
      />
      <RouteWithLayout
        component={RegisterAbalatView}
        exact
        layout={MainLayout}
        path="/register-abalat"
      />
      <RouteWithLayout
        component={RegisterMaekelView}
        exact
        layout={MainLayout}
        path="/register-maekel"
      />
      <RouteWithLayout
        component={RegisterKifilView}
        exact
        layout={MainLayout}
        path="/register-kifil"
      />
      <RouteWithLayout
        component={RegisterSubKifilView}
        exact
        layout={MainLayout}
        path="/register-sub-kifil"
      />
      <RouteWithLayout
        component={AssignGeneralManagerView}
        exact
        layout={MainLayout}
        path="/assign-general-manager"
      />
      <RouteWithLayout
        component={AssignAssistanceGeneralManager}
        exact
        layout={MainLayout}
        path="/assign-assistance-general-manager"
      />
      <RouteWithLayout
        component={SignOutView}
        exact
        layout={EmptyLayout}
        path="/sign-out"
      />
      <RouteWithLayout
        component={GeneralManagerListView}
        exact
        layout={MainLayout}
        path="/general-manager"
      />
      <RouteWithLayout
        component={MaekelManagerListView}
        exact
        layout={MainLayout}
        path="/maekel-manager"
      />
      <RouteWithLayout
        component={KifilManagerListView}
        exact
        layout={MainLayout}
        path="/kifil-manager"
      />
      <RouteWithLayout
        component={MaekelListView}
        exact
        layout={MainLayout}
        path="/maekel"
      />
      <RouteWithLayout
        component={AbalatReportView}
        exact
        layout={MainLayout}
        path="/abalat-report"
      />
      <RouteWithLayout
        component={EditAbalatInfoView}
        exact
        layout={MainLayout}
        path="/edit-abalat-info"
      />

      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
