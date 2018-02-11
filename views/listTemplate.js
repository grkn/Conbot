var listTemplate = class ListTemplate {
  constructor(list){
    this.list = list;
  }
  createButtons(array){
    var buttons = [];
    for(var i = 0; i < array.length ; i++){
      var aButton = {}
      if(array[i].imgUrl){
        aButton = {type : "web_url" , url : array[i].imgUrl,title: array[i].name,"webview_height_ratio": "full","messenger_extensions": false};
      }else{
        aButton = {type : "postback", title : array[i].name,payload : array[i].text};
      }
      buttons.push(aButton);
    }
  }

  createAListTemplate(title, subtitle,imageUrl, buttons){
    return {"title" : title, "subtitle" : subtitle, "buttons" : createButtons(buttons)}
  }
  createListTemplate(){
    var obj = {elements : []};
    for(var i = 0; i < this.list.length; i++){
      obj.elements.push(this.createAListTemplate(this.list[i].title, this.list[i].subtitle, this.list[i].imgUrl, this.list[i].buttons));
    }
    return obj;
  }
}

module.exports = listTemplate;
