<?php
require_once __DIR__ . '/vendor/autoload.php';

const DEFAULT_FILE_NAME = 'default';

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

$loader = new FilesystemLoader('./templates');
$twig = new Environment($loader);
$twig = new Environment($loader, ['debug' => true]);
$twig->addExtension(new \Twig\Extension\DebugExtension());

$recruting = file_get_contents(__DIR__.'/data/recruting') == "ouvert";

$processedBossList = array();
$bossList = json_decode(file_get_contents(__DIR__.'/data/data.json'),true);
foreach ($bossList as $sectionKey => $section)
{
    $processedBossList[$sectionKey]['name'] = $sectionKey;
    foreach ($section as $key => $val) {
        $fileName = iconv(
            'UTF-8',
            'ASCII//TRANSLIT',
            strtr(
                strtolower(
                    $val['name']
                ),
                [' ' => '_', 'ê' => 'e', 'é' => 'e', 'à' => 'a', 'è' => 'e', '\'' => '_', 'É' => 'e', 'â' => 'a', 'î' => 'i', 'Î' => 'i', 'ô' => 'o', '(' => '_', ')' => '_', '-' => '_', 'æ' => 'ae']
            )
        );
        $processedBossList[$sectionKey]["bosses"][$key] = $val;
        switch ($val['type']) {
            case 'nm':
                $processedBossList[$sectionKey]["bosses"][$key]["type"] = 'Défi';
                break;
            case 'ex':
                $processedBossList[$sectionKey]["bosses"][$key]["type"] = 'Extrême';
                break;
            case 'sa':
                $processedBossList[$sectionKey]["bosses"][$key]["type"] = 'Sadique';
                break;
            case 'ul':
                $processedBossList[$sectionKey]["bosses"][$key]["type"] = 'Fatal';
            case 'misc':
                $processedBossList[$sectionKey]["bosses"][$key]["type"] = 'Autre';
            default:
                # code...
                break;
        }
        $processedBossList[$sectionKey]["bosses"][$key]['file'] = file_exists('assets/img/pve/'.$fileName.'.jpg') ? $fileName : DEFAULT_FILE_NAME ;
        $processedBossList[$sectionKey]["bosses"][$key]['stripName'] = $fileName; 
    }
}

echo $twig->render('avancee.twig', ["bosslist" => $processedBossList, "recruting" => $recruting]);
