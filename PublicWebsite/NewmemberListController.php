<?php

require_once "memberDAO.php";

$memberDAO = new NewMemberDAO();
$members = $memberDAO->getAll();

require "memberListTemplate.php";