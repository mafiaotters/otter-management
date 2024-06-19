<?php foreach ($members as $member) : ?>

    <?php
    // Tableau des avatars par défaut
    $defaultAvatars = [
        'assets/img/speakers/defaut.jpg',
        'assets/img/speakers/defaut1.png',
        'assets/img/speakers/defaut2.png', ]; 
    ?>

    <div class="col-lg-4 col-md-6">
        <div class="speaker<?php print(($member->getAvatar2() != "NoAvatar2") ? " multi-avatar" : "")?>">
            <!-- Si avatar existe -->
            <?php if ($member->getAvatar() != "") : ?>
                <?php if ($member->getAvatar2() != "NoAvatar2") : ?>
                    <!-- On affiche l'avatar -->
                    <img src="<?= $member->getAvatar() ?>" onmouseover="setAvatar2(this, '<?= $member->getAvatar() ?>');" onmouseout="unsetAvatar2(this, '<?= $member->getAvatar() ?>');" alt="<?= $member->getFirstname() ?>" class="img-fluid">
                <?php else : ?>
                    <img src="<?= $member->getAvatar() ?>" alt="<?= $member->getFirstname() ?>" class="img-fluid">
                <?php endif ?>
                <?php else : ?>
                    <?php $randomIndex = array_rand($defaultAvatars); ?>
                    <img src="<?= $defaultAvatars[$randomIndex] ?>" alt="<?= $member->getFirstname() ?>" class="img-fluid">
                <?php endif ?>

            <div class="details">
                <h3><?php if ($member->getDesc() !== false) : ?>
                        <!-- On affiche le prénom et le nom avec un espace + desc -->
                        <a href="loutres.php?name=<?= strToLower($member->getFirstname()) ?>">
                            <?= $member->getFirstname() ?> <?= $member->getLastname() ?>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-text" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </a>
                    <?php else : ?>
                        <!-- Sinon on affiche uniquement le prénom et le nom -->
                        <?= $member->getFirstname() ?> <?= $member->getLastname() ?>
                    <?php endif ?>
                </h3>
                <p>
                    <!-- On affiche le titre -->
                    <?= $member->getTitle() ?>
                </p>
            </div>
        </div>
    </div>

<?php endforeach ?>