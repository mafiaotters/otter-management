<?php

require_once "member.php";

class MemberDAO
{

    function getAll()
    {
        return array(
            //Officiers
            new Member("assets/img/speakers/kaaz.jpg", "Kaaz", "Dalhabaz", "Loutre Parrain", true, "Avatar2"),
            new Member("assets/img/speakers/elvyh.jpg", "Elvyh", "Fol'khen", "Loutre Lanceuse de pantoufle", false, "NoAvatar2"),
            new Member("assets/img/speakers/orwen.jpg", "Orwen", "Shepard", "Loutre Mexicaine", false, "NoAvatar2"),
            new Member("assets/img/speakers/sefa.jpg", "Sefa", "Sako", "Loutre Technique", false, "NoAvatar2"),
            new Member("assets/img/speakers/suzu.jpg", "Suzu", "Escoria", "Loutre Jardinière", true, "Avatar2"),
            new Member("assets/img/speakers/soyan.jpg", "Soyan", "Laewen", "Loutre Muette", false, "NoAvatar2"),
            //Membres
            new Member("assets/img/speakers/raziel.jpg", "Raziel", "Light", "Loutre Lascive", true, "Avatar2"),
            new Member("assets/img/speakers/gally.jpg", "Gally", "Four", "Loutre Cuisinière", false, "Avatar2"),
            new Member("assets/img/speakers/iroh.jpg", "Iroh", "Nowaki", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/himea.jpg", "Himea", "Saito", "Loutre Anisée", false, "NoAvatar2"),
            new Member("assets/img/speakers/lyrith.jpg", "Lyrith", "Snow", "Loutre Ninja", false, "NoAvatar2"),
            new Member("assets/img/speakers/aldorey.jpg", "Aldorey", "Kelbourg", "Loutre Abstraite", false, "NoAvatar2"),
            new Member("assets/img/speakers/meitsuko.jpg", "Meitsuko", "Mori", "Loutre Soleil", false, "NoAvatar2"),
            new Member("assets/img/speakers/cerallamangh.jpg", "Cerallamangh", "Olen", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/bao.jpg", "Bao", "Rin'", "Loutre Spectrale", false, "Avatar2"),
            new Member("assets/img/speakers/haru.jpg", "Haru", "Oxgan", "Loutre Miniature", false, "NoAvatar2"),
            new Member("assets/img/speakers/laksha.jpg", "Laksha", "Mayfair", "Loutre Songeuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/jungso.jpg", "Jungso'", "Kha", "Loutre Mafieuse", false, "Avatar2"),
            new Member("assets/img/speakers/abriel.jpg", "Abriel", "Kinoshita", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/tsu.jpg", "Tsu", "Neiro", "Loutre Zen", false, "NoAvatar2"),
            new Member("assets/img/speakers/albariel.jpg", "Albariel", "Hellground", "Loutre Looteuse", false, "NoAvatar2"),  
            new Member("assets/img/speakers/netiri.jpg", "Nhetiri", "Chelsid", "Loutre Conteuse", false, "Avatar2"),
            new Member("assets/img/speakers/velena.jpg", "Velena", "Somne", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/luna.jpg", "Luna", "Earendel", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/yuki", "Yuki", "Uzuka", "Loutre DJ", false, "NoAvatar2"),
            new Member("assets/img/speakers/kseniya.png", "Kseniya", "Aliev", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/themis.jpg", "Themis", "Sarius", "Loutre Emissaire", true, "Avatar2"),
            new Member("assets/img/speakers/nemu.png", "Nemu", "Nanago", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/d.png", "D'", "Fa", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/lizith.jpg", "Lizith", "Kamishiro", "Loutre Démoniaque", false, "NoAvatar2"),
            new Member("", "Nanano", "Akagane", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/nihil.jpg", "Nihil", "Aeternias", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/len.jpg", "Len", "Ichikawa", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("", "Harlockin", "Amikage", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("", "Deidra", "Arkwhite", "Loutre Mafieuse", false, "NoAvatar2"),
            //new Member("", "Mo", "William", "Loutre Mafieuse", false, "NoAvatar2"),
            //FAUX ABSENTS
            //new Member("", "Garma", "Pain", "Loutre Mafieuse", false, "NoAvatar2"),
            //new Member("", "Lust", "Pain", "Loutre Mafieuse", false, "NoAvatar2"),
            //new Member("assets/img/speakers/menma.jpg", "Menma", "Aubetoile", "Loutre Mafieuse", false, "Avatar2"),
            //new Member("assets/img/speakers/yreina.png", "Y'reina", "Leyka", "Loutre Brillante", false, "NoAvatar2"),
            //new Member("assets/img/speakers/corrompu.jpg", "Corrompu", "Tgcm", "Loutre Mafieuse", false, "Avatar2"),
            //new Member("assets/img/speakers/khaela.png", "Khaela", "Archaon", "Loutre Givrée", false, "NoAvatar2"),
            //new Member("assets/img/speakers/nekala.jpg", "Nek'ala", "Etla", "Loutre Mafieuse", false, "NoAvatar2"),
            //new Member("assets/img/speakers/hira.jpg", "Hira", "Mahnue", "Loutre Cupide", false, "NoAvatar2"),
            //new Member("assets/img/speakers/seifer.jpg", "Seifer", "Crom", "Loutre Ours", false, "NoAvatar2"),
            //new Member("", "Kaede", "Kobayashi", "Loutre Mafieuse", false, "NoAvatar2"),
            //new Member("assets/img/speakers/samael.jpg", "Samael", "Zedonius", "Loutre Repentie", false, "Avatar2"),
            //new Member("assets/img/speakers/ryuko.jpg", "Ryuko", "Ken", "Loutre Cartomancienne", false, "NoAvatar2"),
        );
    }
}

class NewMemberDAO
{

    function getAll()
    {
        return array(
            new Member("assets/img/speakers/mimino.jpg", "Mimino", "Mino", "Loutre Princesse", true, "Avatar2"),
            new Member("assets/img/speakers/mayura.jpg", "Mayura", "Pitaya", "Loutre Espiègle", true, "Avatar2"),
            new Member("assets/img/speakers/satoru.jpg", "Satoru", "Gojo", "Loutre Ex-Bras-Droit", false, "NoAvatar2"),
            new Member("assets/img/speakers/diane.jpg", "Diane", "Aetheling", "Loutre Exploratrice", false, "Avatar2"),
            new Member("assets/img/speakers/ciel.jpg", "Ciel", "Elesia", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/lili.jpg", "Dellamorte", "Dellamore", "Loutre Aloha", false, "NoAvatar2"),
            new Member("assets/img/speakers/enei.jpg", "Enei", "Moonglaive", "Loutre Chasseuse", false, "NoAvatar2"),
            new Member("", "Escanor", "Trisdor", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/defaut.jpg", "Sawny", "Sly", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/hyun.jpg", "Hyun", "Kel", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/himiko.jpg", "Himiko", "Takayanagi", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/defaut.jpg", "Mikazuki", "San", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/defaut.jpg", "Ihki'ra", "qataja", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/loulya.jpg", "Loulya", "Llir", "Loutre Mafieuse", false, "NoAvatar2"), 
            new Member("assets/img/speakers/zack.jpg", "Zack", "Angeal", "Loutre Noirissime", false, "NoAvatar2"),  
            new Member("assets/img/speakers/lina.jpg", "Lina", "Prox", "Loutre Incendiaire", false, "Avatar2"),
            new Member("assets/img/speakers/edania.jpg", "Edania", "Dana", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/horsten.jpg", "H'orsten", "Tia", "Loutre Mafieuse", false, "Avatar2"),
            new Member("assets/img/speakers/telya.jpg", "Telya", "Sivih", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("assets/img/speakers/vaan.jpg", "Vaanadiel", "Holmes", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("", "Neiko", "Yazuko", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("", "Hayato", "Kenpaichi", "Loutre Mafieuse", false, "NoAvatar2"),
            new Member("", "Hydra", "Houla", "Loutre Mafieuse", false, "NoAvatar2"), 
            new Member("", "Dy'the", "Meteor", "Loutre Mafieuse", false, "NoAvatar2"),
            //new Member("assets/img/speakers/chicho.png", "Chicho", "Lini", "Loutre Mafieuse", false, "NoAvatar2"),
            //new Member("assets/img/speakers/shadow.png", "Shadow", "Dragona", "Loutre Mafieuse", false, "NoAvatar2"),
            //new Member("assets/img/speakers/nimuah.png", "Nimu'ah", "Blackness", "Loutre Mafieuse", false, "NoAvatar2"),
            //new Member("", "Ladonya", "Hyskaris", "Loutre Mafieuse", false, "NoAvatar2"),
            
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
            new Member("assets/img/speakers/kyoka.jpg", "Kyoka", "D'arendelle", "Cinis Chimaeras", false, "NoAvatar2"),
            new Member("assets/img/speakers/ella.jpg", "Ella", "Danloce", "Cinis Chimaeras", false, "NoAvatar2"),
        );
    }
}