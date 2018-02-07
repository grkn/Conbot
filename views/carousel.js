
var carousel = class Carousel {

  constructor(list){
    this.list = list;
  }

/*<img width="250px" height="150px" src="https://static.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg"/>
<div class="text-title-subtitle">
  <div><b>Title</b></div>
  <div>Subtitle</div>
  <button style="width:250px" type="button" class="btn btn-info">Button</button>
  <button style="width:250px" type="button" class="btn btn-info">Button</button>
  <button style="width:250px" type="button" class="btn btn-info">Button</button>
</div>*/

  createACarousel(imgUrl,title,subtitle,buttons){
    return {"image_url" : imgUrl,"title" : title,"subtitle" : subtitle,"buttons" : buttons}
  }

  createListCarousel(){
    var obj = [];
    for(var i=0; i < this.list.length;i++){
      obj.push(this.createACarousel(this.list[i].imgUrl,this.list[i].title,this.list[i].subtitle,this.list[i].buttons));
    }
    return obj;
  }


}

module.exports = carousel;
