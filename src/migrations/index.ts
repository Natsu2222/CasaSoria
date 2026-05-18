import * as migration_20260514_121847 from './20260514_121847';
import * as migration_20260518_105737 from './20260518_105737';

export const migrations = [
  {
    up: migration_20260514_121847.up,
    down: migration_20260514_121847.down,
    name: '20260514_121847',
  },
  {
    up: migration_20260518_105737.up,
    down: migration_20260518_105737.down,
    name: '20260518_105737'
  },
];
