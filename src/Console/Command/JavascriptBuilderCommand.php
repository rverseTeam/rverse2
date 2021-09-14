<?php
/**
 * Holds the javascript builder command controller.
 */

namespace Miiverse\Console\Command;

use Miiverse\Translation;
use MatthiasMullie\Minify;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Starts up a development server.
 *
 * @author Repflez
 */
class JavascriptBuilderCommand extends Command
{
    private const JS_FILES_3DS = 'public/js/src/n3ds/';
    private const JS_DEST_3DS = 'public/js/n3ds/';

    /**
     * Set up the command metadata.
     */
    protected function configure() : void
    {
        $this->setName('js:build')
            ->setDescription('Builds the JS language files')
            ->setHelp('This command builds the Javascript files for each language supported by rverse.');
    }

    /**
     * Build the Javascript
     */
    protected function execute(InputInterface $input, OutputInterface $output) : int
    {
        $languages = [
            Translation::LANGUAGE_JAPANESE,
            Translation::LANGUAGE_ENGLISH,
            Translation::LANGUAGE_FRENCH,
            Translation::LANGUAGE_ITALIAN,
            Translation::LANGUAGE_SPANISH,
            Translation::LANGUAGE_SIMPLIFIED_CHINESE,
            Translation::LANGUAGE_KOREAN,
            Translation::LANGUAGE_DUTCH,
            Translation::LANGUAGE_PORTUGUESE,
            Translation::LANGUAGE_RUSSIAN,
            Translation::LANGUAGE_TRADITIONAL_CHINESE,
        ];

        foreach ($languages as $language) {
            $js = new Minify\JS();

            $js->add(self::JS_FILES_3DS . 'libs.js');
            $js->add(self::JS_FILES_3DS . 'olv.js');
            $js->add(self::JS_FILES_3DS . "olv.locale-$language.js");

            $js->minify(self::JS_DEST_3DS . "complete-$language.js");

            $output->writeln("<info>Built JS for 3DS language $language</info>");
        }

        return Command::SUCCESS;
    }
}
