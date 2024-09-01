<?php
    require_once "member.php";
class MemberDAO
{
    function getAll()
    {
        return array(
            new Member("assets/img/speakers/Piik.jpg", "Piik", "", "Le Parrain", false, "assets/img/speakers/Piik_1.jpg"),
            new Member("assets/img/speakers/jungso.jpg", "Jungso'", "Kha", "Loutre Mafieuse", false, ""),
        );
    }
}
    
class FriendsMemberDAO
{

    function getAll()
    {
        return array(
            new Member("assets/img/speakers/ochi.jpg", "Ochi", "Mochi", "Cinis Chimaeras", true, "Avatar2"),
            new Member("assets/img/speakers/flora.jpg", "Flora", "Mantis", "Cinis Chimaeras", false, "Avatar2"),
            new Member("assets/img/speakers/kajiya.jpg", "Kajiya", "Nahel", "Cinis Chimaeras", false, "NoAvatar2"),
		      	new Member("assets/img/speakers/alys.jpg", "Alys", "Huin", "Cinis Chimaeras", false, "NoAvatar2"),
			      new Member("", "Kayak", "Hamo", "Cinis Chimaeras", false, "NoAvatar2"),
            new Member("assets/img/speakers/ella.jpg", "Ella", "Danloce", "Cinis Chimaeras", false, "NoAvatar2"),
        );
    }
}