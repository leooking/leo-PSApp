import { createRouter, createWebHistory } from 'vue-router'
import toast from '../lib/toast'
import user from '../lib/user'
import { infos } from '../lib/messages'

// put "public: true" on non-auth routes, else omit
const ROUTES = [
  {
    path: '/',
    name: 'user_dashboard',
    public: true,
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/session/email',
    name: 'email',
    public: true,
    component: () => import('../views/auth/EmailView.vue'),
  },
  {
    path: '/session/2fa',
    name: '2fa',
    public: true,
    component: () => import('../views/auth/2FAView.vue'),
  },
  {
    path: '/auth0/callback',
    name: 'auth0Callback',
    public: true,
    component: () => import('../views/auth/Auth0Callback.vue'),
  },
  {
    path: '/session/password',
    name: 'password',
    public: true,
    component: () => import('../views/auth/PasswordView.vue'),
  },
  {
    path: '/verify_email',
    name: 'verify_email',
    public: true,
    component: () => import('../views/auth/EmailVerificationView.vue'),
  },
  {
    path: '/session/forgot_password',
    name: 'forgot_password',
    public: true,
    component: () => import('../views/auth/PasswordForgotView.vue'),
  },
  {
    path: '/session/password_reset',
    name: 'password_reset',
    public: true,
    component: () => import('../views/auth/PasswordResetView.vue'),
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('../views/HelpView.vue'),
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/projects/ProjectsListView.vue'),
  },
  {
    path: '/projects/:pid',
    name: 'project',
    component: () => import('../views/projects/ProjectDetailView.vue'),
  },
  {
    path: '/assets',
    name: 'assets',
    component: () => import('../views/assets/AssetsListView.vue'),
  },
  {
    path: '/assets/:pid',
    name: 'asset',
    component: () => import('../views/assets/AssetDetailView.vue'),
  },
  {
    path: '/assets/:pid/convo',
    name: 'asset_convo',
    component: () =>
      import('../views/generators/AssetConvoInteractionView.vue'),
  },
  {
    path: '/assets/:pid/ask_shipley',
    name: 'asset_shipley',
    component: () =>
      import('../views/generators/AssetConvoInteractionView.vue'),
  },
  {
    path: '/assets/:pid/ask_lohfeld',
    name: 'asset_lohfeld',
    component: () => import('../views/generators/Winmore2View.vue'),
  },
  {
    path: '/assets/:pid/smartcheck',
    name: 'smartcheck',
    component: () => import('../views/generators/SmartCheckView.vue'),
  },
  {
    path: '/assets/:pid/intellibid-2',
    name: 'intellibid-2',
    component: () => import('../views/generators/Intellibid2View.vue'),
  },
  {
    path: '/assets/:pid/winmore-2',
    name: 'winmore-2',
    component: () => import('../views/generators/Winmore2View.vue'),
  },
  {
    path: '/assets/:pid/multi',
    name: 'asset_multi',
    component: () =>
      import('../views/generators/AssetMultiInteractionView.vue'),
  },
  {
    path: '/projects/new',
    name: 'new_project',
    component: () => import('../views/projects/ProjectCreateView.vue'),
  },
  {
    path: '/projects/:pid/edit',
    name: 'edit_project',
    component: () => import('../views/projects/ProjectEditView.vue'),
  },
  {
    path: '/resources',
    name: 'resources',
    component: () => import('../views/resources/ResourcesListView.vue'),
  },
  {
    path: '/resources/:pid',
    name: 'resource',
    component: () => import('../views/resources/ResourceDetailView.vue'),
  },
  {
    path: '/resources/new',
    name: 'new_resource',
    component: () => import('../views/resources/ResourceCreateView.vue'),
  },
  {
    path: '/resources/:pid/edit',
    name: 'edit_resource',
    component: () => import('../views/resources/ResourceEditView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
  },
  {
    path: '/opportunity-search',
    name: 'opportunity_search',
    component: () => import('../views/OpportunitySearchView.vue'),
  },
  {
    path: '/agencies',
    name: 'agencies',
    component: () => import('../views/AgenciesView.vue'),
  },
  {
    path: '/:catchAll(.*)',
    public: true,
    component: () => import('../views/404View.vue'),
  },
  {
    path: '/admin',
    name: 'admin_dashboard',
    component: () => import('../views/customer_admin/CADashboardView.vue'),
  },
  {
    path: '/admin/licenses',
    name: 'ca_licenses',
    component: () => import('../views/customer_admin/CALicensesView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: ROUTES,
})

function testRouteAccess() {
  return ROUTES.filter((r) => r.public === true).map((r) => r.name)
}

router.beforeEach(async (to, from) => {
  if (!user.signedIn && !testRouteAccess().includes(to.name)) {
    toast.info(infos.auth.required)
    return { name: 'email' }
  }
})

export default router
