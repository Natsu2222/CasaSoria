import * as migration_20260514_121847 from './20260514_121847';
import * as migration_20260518_105737 from './20260518_105737';
import * as migration_20260518_144714_location_and_servicios_soria_blocks from './20260518_144714_location_and_servicios_soria_blocks';
import * as migration_20260518_154426 from './20260518_154426';
import * as migration_20260519_101519 from './20260519_101519';
import * as migration_20260519_115103_navbar_soria from './20260519_115103_navbar_soria';

export const migrations = [
  {
    up: migration_20260514_121847.up,
    down: migration_20260514_121847.down,
    name: '20260514_121847',
  },
  {
    up: migration_20260518_105737.up,
    down: migration_20260518_105737.down,
    name: '20260518_105737',
  },
  {
    up: migration_20260518_144714_location_and_servicios_soria_blocks.up,
    down: migration_20260518_144714_location_and_servicios_soria_blocks.down,
    name: '20260518_144714_location_and_servicios_soria_blocks',
  },
  {
    up: migration_20260518_154426.up,
    down: migration_20260518_154426.down,
    name: '20260518_154426',
  },
  {
    up: migration_20260519_101519.up,
    down: migration_20260519_101519.down,
    name: '20260519_101519',
  },
  {
    up: migration_20260519_115103_navbar_soria.up,
    down: migration_20260519_115103_navbar_soria.down,
    name: '20260519_115103_navbar_soria'
  },
];
