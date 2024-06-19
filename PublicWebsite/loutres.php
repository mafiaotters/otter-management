<?php
require_once __DIR__ . '/vendor/autoload.php';

use Twig\Loader\FilesystemLoader;
use Twig\Environment;

$loader = new FilesystemLoader('./templates');
$twig = new Environment($loader);

$loutre = $_GET['name'];

$otterList = json_decode(file_get_contents(__DIR__ . '/data/otter.json'), true);

$recruting = file_get_contents(__DIR__.'/data/recruting') == "ouvert";

if (false === isset($otterList[$loutre])) {
    http_response_code(404);
    include('404.html');
    die;
}

echo $twig->render('loutres.twig', ["member" => $otterList[$loutre], "recruting" => $recruting]);