<?php
/**
 * Holds the New Migration Creation command controller.
 */

namespace Miiverse\Console\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\FormatterHelper;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Installs the Display Name change repository.
 *
 * @author Repflez
 */
class CreateNewMigrationCommand extends Command
{
    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('db:new-mig')
            ->addArgument('name', InputArgument::REQUIRED, 'Migration name')
            ->setDescription('Create a new migration')
            ->setHelp('This command allows creating a brand new migration.');
    }

    /**
     * Changes the Display Name.
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $formatter = $this->getHelper('formatter');
        $name = $input->getArgument('name');

        if(!preg_match('#^([a-z_]+)$#', $name)) {
            $output->writeln($formatter->formatBlock(['Error!', 'Migration name may only contain alpha and _ characters.'], 'error', true));
            return Command::INVALID;
        }

        $filename = date('Y_m_d_His_') . trim($name, '_') . '.php';
        $filepath = path("database/$filename");
        $namespace = snake_to_camel($name);

        $template = <<<MIG
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Miiverse\DB;

class $namespace extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \$schema = DB::getSchemaBuilder();

        // ...
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \$schema = DB::getSchemaBuilder();

        // ...
    }
}
MIG;

        file_put_contents($filepath, $template);
        
        $output->writeln($formatter->formatBlock(['Success!', "Template for '{$namespace}' has been created."], 'info', true));
        return Command::SUCCESS;
    }
}