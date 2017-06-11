<?php

/**
 * @package    Page
 * @author     Zao Soula - Zarque
 * @version    1.0

 */

class RSS {
    private $feeds;


    public function __construct($data = array())
    {
        if(!empty($data))
            $this->setFeeds($data);
    }


    public function fetch(){
      $tmp = array();
      foreach($this->feeds as $feed){
        $content = file_get_contents($feed);
        $x = new SimpleXmlElement($content);
        $tmp[]=$x->channel;
      }
      return (object) $tmp;
    }

  public function getFeeds(){
      return $this->feeds;
  }

  public function setFeeds($feeds){
      $this->feeds = $feeds;
      return $this;
  }

}
?>
