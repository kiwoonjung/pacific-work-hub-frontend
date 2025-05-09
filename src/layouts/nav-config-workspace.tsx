import { CONFIG } from 'src/global-config';

import type { WorkspacesPopoverProps } from './components/workspaces-popover';

// ----------------------------------------------------------------------

export const _workspaces: WorkspacesPopoverProps['data'] = [
  {
    id: 'pfp',
    name: 'Pacific Fresh Produce',
    plan: 'Free',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/pfp.png`,
  },
  {
    id: 'team-2',
    name: 'Team 2',
    plan: 'Pro',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-2.webp`,
  },
];
