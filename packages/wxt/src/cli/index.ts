import cli from './commands';
import { version } from '../version';
import { isAliasedCommand } from './cli-utils';

// Grab the command that we're trying to run
cli.parse(process.argv, { run: false });

// If it's not an alias, add the help and version options, then parse again
if (!isAliasedCommand(cli.matchedCommand)) {
  cli.help();
  cli.version(version);
  cli.parse(process.argv, { run: false });
}

// Run the alias or command
await cli.runMatchedCommand();
