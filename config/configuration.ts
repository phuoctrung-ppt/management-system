import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILE_NAME = `${process.env.NODE_ENV ?? 'default'}.yaml`;

export default () => {
  const config = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILE_NAME), 'utf8'),
  ) as Record<string, any>;
  if (config.app.port < 1024 || config.app.port > 49151) {
    throw new Error('HTTP port must be between 1024 and 49151');
  }

  return config;
};
