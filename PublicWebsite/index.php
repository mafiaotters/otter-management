<!DOCTYPE html>
<html lang="fr">

<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-180274113-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'UA-180274113-1');
    </script>

    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>La Mafia des Loutres - Compagnie Libre FFXIV - Ragnarok</title>
    <meta content="" name="descriptison">
    <meta content="" name="keywords">
    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="57x57" href="/assets/icons/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/assets/icons/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/assets/icons/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/assets/icons/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/assets/icons/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/assets/icons/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/assets/icons/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/assets/icons/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/icons/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/assets/icons/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png">
    <link rel="manifest" href="/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/assets/icons/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,700,700i|Raleway:300,400,500,700,800" rel="stylesheet">
    <!-- Vendor CSS Files -->
    <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="assets/vendor/animate.css/animate.min.css" rel="stylesheet">
    <link href="assets/vendor/venobox/venobox.css" rel="stylesheet">
    <link href="assets/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="assets/vendor/owl.carousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
    <!-- Template Main CSS File -->
    <link href="assets/css/style.css" rel="stylesheet">
</head>

<body>
    <!-- ======= Header ======= -->
    <header id="header">
        <div class="container">
            <div id="logo" class="pull-left">
                <a href="index.php" class="scrollto"><img src="assets/img/logo.png" alt="" title=""></a>
            </div>
            <nav id="nav-menu-container">
                <ul class="nav-menu">
                    <li class="menu-active"><a href="index.php">Accueil</a></li>
                    <li><a href="#about">À propos</a></li>
                    <li><a href="#members">Les Loutres</a></li>
                    <li><a href="#maison">Maison</a></li>
                    <li><a href="#event">Événements</a></li>
                    <li><a href="#galerie">Galerie</a></li>
                    <li><a href="#faq">F.A.Q</a></li>
                    <?php 
                    $recruting = file_get_contents(__DIR__.'/data/recruting') == "ouvert";
                    if (true === $recruting) {
                        echo '<li><a href="https://discord.gg/RjrudBw4yd" target="_blank">Discord</a></li>';
                    }
                    ?>
                    <li><a href="avancee.php">PvE</a></li>
                </ul>
            </nav>
            <!-- #nav-menu-container -->
        </div>
    </header>
    <!-- End Header -->
    <!-- ======= Intro Section ======= -->
    <section id="intro">
        <div class="intro-container wow fadeIn">
            <h1 class="mb-4 pb-0">
                La
                <span>Mafia</span>
                <br>
                des Loutres
            </h1>
            <p class="mb-4 pb-0">
                - Compagnie Libre FFXIV • Ragnarok -
            </p>
        </div>
    </section>
    <!-- End Intro Section -->
    <main id="main">
        <!-- ======= About Section ======= -->
        <section id="about">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8">
                        <h2>La Mafia des Loutres</h2>
                        <p>
                            Soyez les bienvenus sur le site de la compagnie libre <a href="https://fr.finalfantasyxiv.com/lodestone/freecompany/9237023573225363640/" target="_blank">La Mafia des Loutres.</a>
                            <br>
                            <br>
                            Qui sommes-nous ? Une bande de joyeux lurons plus déjantés les uns que les autres qui
                            partageons des agréables moments ensemble dans la choutitude la plus extrême, d'où notre
                            animal emblématique : la sainte loutre. Que tu sois un métalleux IRL qui intérieurement rêve
                            d'être une licorne, une princesse qui défonce de l'extrême ou simplement un joueur sympa qui
                            souhaite évoluer dans la joie et la bonne humeur, alors cette CL est faite pour toi.
                            <br>
                            <br>
                            Quels types de joueurs cherchons-nous ? Tant que tu respectes tes pairs et que tu souhaites
                            partager des bons moments, tu corresponds à notre recherche, que tu sois un joueur débutant,
                            expérimenté, vétéran, casual ou pro gamer. Nous faisons tous types d'activités, des sorties
                            farm monture, des extrêmes et même bientôt du sadique et plus. Sans oublier la petite soirée
                            cartes au trésor pour se détendre et l'entraide pour l'avancée à la découverte d'Eorzéa et
                            de ses merveilles.
                            <br>
                            <br>
                            Alors n'attends plus ! De toute façon, si tu es arrivé jusqu'à ce point de la présentation,
                            c'est que ta curiosité a été piquée au vif et que tu es au moins aussi déjanté que nous.
                            <br>
                            <br>
                            Come to the otter side, we have cookies!
                        </p>
                    </div>
                    <div class="col-lg-4" id="logo_loutre">
                        <img src="assets/img/logo_loutre.png" class="img-fluid">
                    </div>
                </div>
            </div>
        </section>
        <!-- End About Section -->


        <!-- ======= Speakers Section ======= -->
        <section id="speakers" class="wow fadeInUp">
            <div class="container">
                <div class="section-header">
                    <h2>Quelques Loutres</h2>
                    <p>
                        Elles ne sont pas choutes ?
                    </p>
                    <p>
                        Cliquez sur certaines d'entre elles pour en apprendre plus !
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-text" viewBox="0 0 16 16">
                            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                            <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
                        </svg>
                    </p>
                </div>
                <!-- ======= Loutres Section ======= -->


                <section id="members">
                    <div class="container wow fadeInUp">
                        <ul class="nav nav-loutres nav-tabs" role="tablist">
                            <li class="nav-item"><a class="nav-link active" href="#loutre-1" role="tab" data-toggle="tab">Les Mafieux</a></li>
                            <li class="nav-item"><a class="nav-link" href="#loutre-4" role="tab" data-toggle="tab">Les Licornes</a></li>
                        </ul>
                        <div class="tab-content row justify-content-center">
                            <!-- Loutre actives -->
                            <div role="tabpanel" class="col-lg-16 tab-pane fade show active" id="loutre-1">
                                <div class="row">

                                    <?php require "memberListController.php" ?>

                                </div>
                            </div>

                            <!-- Friends -->
                            <div role="tabpanel" class="col-lg-16 tab-pane fade show" id="loutre-4">
                                <div class="row">

                                    <?php require "FriendsmemberListController.php" ?>

                                </div>
                            </div>

                        </div>
                </section>
            </div>
        </section>
        </div>
        </section>
        <!-- End Test Section -->
        <!-- ======= Maison de compagnie Section ======= -->
        <section id="maison" class="section-with-bg wow fadeInUp">
            <div class="container">
                <div class="section-header">
                    <h2>
                        Maison de Compagnie
                    </h2>
                    <p>
                        Lavandière, Secteur 22, Parcelle 36
                    </p>
                </div>
                <div class="row">
                    <div class="col-lg-4 col-md-6">
                        <div class="maison">
                            <div class="maison-img">
                                <img src="assets/img/maison/1.jpg" alt="maison 1" class="img-fluid">
                            </div>
                            <h3><a href="#">Le Jardin</a></h3>
                            <p>
                                Elles ne sont pas chouttes, ces loutres ?
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="maison">
                            <div class="maison-img">
                                <img src="assets/img/maison/2.jpg" alt="maison 2" class="img-fluid">
                            </div>
                            <h3><a href="#">Les Bains</a></h3>
                            <p>
                                Un peu de repos pour ces mafieux.
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="maison">
                            <div class="maison-img">
                                <img src="assets/img/maison/3.jpg" alt="maison 3" class="img-fluid">
                            </div>
                            <h3><a href="#">Le Sous-Sol</a></h3>
                            <p>
                                Une petite danse ? ♪
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- End maison Section -->
        <!-- ======= Schedule Section ======= -->
        <section id="speakers">
            <div class="container wow fadeInUp">
                <div class="section-header">
                    <h2>Activités régulières</h2>
                    <p>
                        Du moins, quelques exemples.
                    </p>
                </div>

                <section id="event">
                    <div class="container wow fadeInUp">
                        <div class="tab-content row justify-content-center">
                            <!-- Loutre actives -->
                            <div role="tabpanel" class="col-lg-16 tab-pane fade show active" id="loutre-1">
                                <div class="row">
                                    <!-- Cartes -->
                                    <div class="col-lg-4 col-md-6">
                                        <div class="speaker">
                                            <img alt="cartes" class="img-fluid" src="assets/img/activites/cartes.jpg" />
                                            <div class="details">
                                                <h3>Vieilles Cartes</h3>
                                                <p>
                                                    On n'a jamais assez de gils !
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Montures -->
                                    <div class="col-lg-4 col-md-6">
                                        <div class="speaker">
                                            <img alt="cartes" class="img-fluid" src="assets/img/activites/montures.jpg" />
                                            <div class="details">
                                                <h3>Farm Montures</h3>
                                                <p>
                                                    Attrapez-les tous !
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Montures -->
                                    <div class="col-lg-4 col-md-6">
                                        <div class="speaker">
                                            <img alt="cartes" class="img-fluid" src="assets/img/activites/hl.jpg" />
                                            <div class="details">
                                                <h3>Extrêmes & Sadiques</h3>
                                                <p>
                                                    Parce que c'est bien d'avoir mal.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Montures -->
                                    <div class="col-lg-4 col-md-6">
                                        <div class="speaker">
                                            <img alt="cartes" class="img-fluid" src="assets/img/activites/decouverte.jpg" />
                                            <div class="details">
                                                <h3>Découverte & progression</h3>
                                                <p>
                                                    Ancien et nouveau contenu, tout est important.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Concours -->
                                    <div class="col-lg-4 col-md-6">
                                        <div class="speaker">
                                            <img alt="cartes" class="img-fluid" src="assets/img/activites/concours.jpg" />
                                            <div class="details">
                                                <h3>Concours</h3>
                                                <p>
                                                    Chaque début de mois, un nouveau concours.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Montures -->
                                    <div class="col-lg-4 col-md-6">
                                        <div class="speaker">
                                            <img alt="cartes" class="img-fluid" src="assets/img/activites/social.jpg" />
                                            <div class="details">
                                                <h3>Social</h3>
                                                <p>
                                                    Discutons de tout et n'importe quoi sur Discord !
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- End Loutres 1 -->
                        </div>
                    </div>
                </section>
            </div>
        </section>
        <!-- End Schedule Section -->
        <!-- ======= Gallery ======= -->
        <section id="galerie" class="section-with-bg wow fadeInUp">
            <div class="container-fluid">
                <div class="section-header">
                    <h2>
                        Galerie
                    </h2>
                    <p>
                        C'est quoi être une loutre ? C'est ça !
                    </p>
                </div>
            </div>
            <div class="container-fluid venue-gallery-container">
                <div class="row no-gutters">
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/1.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/1.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/2.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/2.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/3.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/3.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/4.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/4.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/5.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/5.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/6.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/6.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/7.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/7.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/8.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/8.png" alt="" class="img-fluid"></a>
                        </div>
                        </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/9.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/9.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/10.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/10.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/11.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/11.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="venue-gallery">
                            <a href="assets/img/venue-gallery/12.png" class="venobox" data-gall="venue-gallery"><img src="assets/img/venue-gallery/12.png" alt="" class="img-fluid"></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- End Venue Section -->
        <!-- =======  F.A.Q Section ======= -->
        <section id="faq" class="wow fadeInUp">
            <div class="container">
                <div class="section-header">
                    <h2>
                        F.A.Q
                    </h2>
                </div>
                <div class="row justify-content-center">
                    <div class="col-lg-9">
                        <ul id="faq-list">
                            <li>
                                <a data-toggle="collapse" class="collapsed" href="#faq1">Qui peut rejoindre La Mafia des
                                    Loutres ?<i class="fa fa-minus-circle"></i></a>
                                <div id="faq1" class="collapse" data-parent="#faq-list">
                                    <p>
                                    La compagnie ouvre ses portes à toute personne sur Ragnarok voulant jouer dans le respect et dans la bonne humeur. 
                                    Que vous soyez vétéran ou nouveau joueur, nous allons vous accueillir à bras ouverts. 
                                    La seule condition requise est la politesse. 
                                    Un simple bonjour en vous connectant donnera le sourire !
                                    </p>
                                </div>
                            </li>
                            <li>
                                <a data-toggle="collapse" href="#faq2" class="collapsed">Comment rejoindre la compagnie
                                    libre ?<i class="fa fa-minus-circle"></i></a>
                                <div id="faq2" class="collapse" data-parent="#faq-list">
                                    <p>
                                        Pour nous rejoindre, rien de plus simple. Il suffit de nous contacter
                                        directement ou de passer par le système de recrutement en jeu. Si vous avez des
                                        questions, n'hésitez pas à contacter Kaaz Dalhabaz ou Raziel Light. Nous nous
                                        ferons une joie de vous répondre ! Les autres loutres sont tout autant capables
                                        de répondre à vos questions. Donc n'hésitez pas à les solliciter si nous ne
                                        sommes pas présents.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <a data-toggle="collapse" href="#faq3" class="collapsed">Les sorties, comment ça se
                                    passe ?<i class="fa fa-minus-circle"></i></a>
                                <div id="faq3" class="collapse" data-parent="#faq-list">
                                    <p>
                                        L'organisation des sorties se fait principalement via Discord (Evidemment, cela
                                        n'empêche pas d'organiser des sorties sur un coup de tête en jeu). Nous postons
                                        des évènements toutes les semaines et les membres s'inscrivent via le Bot
                                        présent sur le canal dédié (#inscriptions-raids). A la date prévue, il ne reste
                                        plus qu'à se rejoindre à l'heure et profiter de cette soirée de folie !
                                        Toutefois, si vous êtes inscrit à un événement, nous vous demanderons d'être
                                        présent ou de prévenir si urgence de dernière minute.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <a data-toggle="collapse" href="#faq4" class="collapsed">Une obligation de présence en
                                    jeu ?<i class="fa fa-minus-circle"></i></a>
                                <div id="faq4" class="collapse" data-parent="#faq-list">
                                    <p>
                                        Nous ne demandons aucune présence obligatoire en jeu. Cependant un petit message
                                        pour nous avertir que vous serez absent sur une longue période nous rassurera.
                                        La guilde est avant tout une famille et nous pourrions nous inquiéter de
                                        l'absence prolongée de l'une de nos Loutres.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <a data-toggle="collapse" href="#faq5" class="collapsed">Discord, sommes-nous obligé d'y
                                    aller ?<i class="fa fa-minus-circle"></i></a>
                                <div id="faq5" class="collapse" data-parent="#faq-list">
                                    <p>
                                        Nous n'avons aucune obligation d'être en vocal sur Discord en dehors des Raids.
                                        Toutefois, cela ne vous oblige pas à parler. Cela est simplement plus simple
                                        pour expliquer les stratégies et d'annoncer celles-ci lors du combat en cours.
                                        Pour ce qui est de l'écrit, cela aide à la vie de la guilde (organisation de
                                        sortie, liens utiles, concours...), ainsi, nous vous encourageons à participer !
                                    </p>
                                </div>
                            </li>
                            <li>
                                <a data-toggle="collapse" href="#faq6" class="collapsed">Disposez-vous d'un roster ?<i class="fa fa-minus-circle"></i></a>
                                <div id="faq6" class="collapse" data-parent="#faq-list">
                                    <p>
                                    Il y a actuellement deux rosters dans la compagnie. 
                                    Ils sont composés de Loutres et de Licornes !
                                    Il n'est pas prévu de créer de nouveaux rosters.
                                    Toutefois, des sorties pour du contenu haut niveau sont toutefois organisées régulièrement, hors roster, afin de tomber ce type de contenu avec la compagnie !
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <!-- End  F.A.Q Section -->
    </main>
    <!-- End #main -->
    <!-- ======= Footer ======= -->
    <footer id="footer">
        <div class="footer-top">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 col-md-6 footer-info">
                        <!-- VIDE -->
                    </div>
                    <div class="col-lg-4 col-md-6 footer-links">
                        <img src="assets/img/footer_Loutres.png" alt="Mafia des Loutres" id="footer_logo">
                    </div>
                    <div class="col-lg-4 col-md-6 footer-links">
                        <!-- VIDE -->
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="copyright">
                La Mafia des Loutres &copy; 2019-2021. FINAL FANTASY XIV &copy; 2010-2019 SQUARE ENIX CO., LTD. All
                Rights Reserved.
            </div>
        </div>
    </footer>
    <!-- End  Footer -->
    <a href="#" class="back-to-top"><i class="fa fa-angle-up">
        </i>
    </a>
    <!-- Vendor JS Files -->
    <script src="assets/vendor/jquery/jquery.min.js"></script>
    <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="assets/vendor/jquery.easing/jquery.easing.min.js"></script>
    <script src="assets/vendor/wow/wow.min.js"></script>
    <script src="assets/vendor/venobox/venobox.min.js"></script>
    <script src="assets/vendor/owl.carousel/owl.carousel.min.js"></script>
    <script src="assets/vendor/superfish/superfish.min.js"></script>
    <script src="assets/vendor/hoverIntent/hoverIntent.js"></script>
    <!-- Template Main JS File -->
    <script src="assets/js/main.js"></script>
    <!-- Custom JS -->
    <script src="assets/js/img.js"></script>
</body>

</html>

</div>
</div>
</body>

</html>