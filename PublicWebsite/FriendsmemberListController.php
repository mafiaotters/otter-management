<?php

require_once "memberDAO.php";

$memberDAO = new FriendsMemberDAO();
$members = $memberDAO->getAll();

require "memberListTemplate.php";