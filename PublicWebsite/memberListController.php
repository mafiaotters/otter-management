<?php

require_once "memberDAO.php";

$memberDAO = new MemberDAO();
$members = $memberDAO->getAll();

require "memberListTemplate.php";