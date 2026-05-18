import * as migration_20260514_121847 from './20260514_121847';
import * as migration_20260518_105737 from './20260518_105737';
import * as migration_20260518_144714_location_and_servicios_soria_blocks from './20260518_144714_location_and_servicios_soria_blocks';
import * as migration_20260518_154426 from './20260518_154426';

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
    name: '20260518_154426'
  },
];
