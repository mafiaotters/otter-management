<?php

class Member
{

    private $avatar, $firstname, $lastname, $title, $desc, $avatar2, $randomAvatar;

    function __construct($avatar, $firstname, $lastname, $title, $desc, $avatar2, $randomAvatar = 0)
    {
        $this->avatar = $avatar;
        $this->firstname = $firstname;
        $this->lastname = $lastname;
		$this->title = $title;
        $this->desc = $desc;
        $this->avatar2 = $avatar2;
        $this->randomAvatar = $randomAvatar;
    }

    /**
     * Get the value of avatar
     */ 
    public function getAvatar()
    {
        if ($this->randomAvatar > 0) {
            return substr($this->avatar, 0, -4) . rand(0, $this->randomAvatar) . '.jpg'; 
        } else {
            return $this->getTrueAvatar();
        }
    }

    public function getTrueAvatar()
    {
        return $this->avatar;
    }

    /**
     * Get the value of firstname
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Get the value of lastname
     */
    public function getLastname()
    {
        return $this->lastname;
    }
	
	/**
     * Get the value of title
     */
    public function getTitle()
    {
        return $this->title;
    }
    
    /**
     * Get the value of desc
     */
    public function getDesc()
    {
        return $this->desc;
    }

    /**
     * Get the value of desc
     */
    public function getAvatar2()
    {
        return $this->avatar2;
    }
}