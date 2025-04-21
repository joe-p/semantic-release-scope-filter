import { createRequire } from "module";
import { posix } from "path";
import { Transform } from "readable-stream";

const require = createRequire(import.meta.url);
let verified;

/**
 * Called by semantic-release during the verification step
 *
 * This monkey-patching approach is from https://github.com/folke/semantic-release-commit-filter
 * The main difference is that this plugin uses the verifyConditions step so we have access to pluginConfig
 *
 * @param {*} pluginConfig The semantic-release plugin config
 * @param {*} context The context provided by semantic-release
 */
export async function verifyConditions(pluginConfig, context) {
  const { scopes, filterOutMissingScope } = pluginConfig;

  if (!filterOutMissingScope) scopes.push("");
  const { logger } = context;
  Object.keys(require.cache)
    .filter((m) =>
      posix.normalize(m).endsWith("/node_modules/git-log-parser/src/index.js"),
    )
    .forEach((moduleName) => {
      const parse = require.cache[moduleName].exports.parse;
      require.cache[moduleName].exports.parse = (config, options) => {
        const ret = parse(config, options);

        return ret.pipe(
          new Transform({
            objectMode: true,
            transform(chunk, enc, callback) {
              let scope = chunk.subject?.match(/\w+\((.*)\):/)?.[1] ?? "";
              if (scopes.includes(scope)) {
                this.push(chunk);
              } else {
                logger.log(
                  `Filtering out ${chunk.commit.short} because "${scope}" is not in the list of scopes: ${scopes}`,
                );
              }
              callback();
            },
          }),
        );
      };
    });

  verified = true;
}
