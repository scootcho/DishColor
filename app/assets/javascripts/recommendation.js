var rotateInterval,
    derotateInterval;
function rotateWheel($elem){
  var delta = 1;
  var now = 0
  rotateInterval = setInterval(function(){
    now = now + delta;
    $elem.css('-webkit-transform','rotate('+now+'deg)');
    $elem.css('-moz-transform','rotate('+now+'deg)');
    $elem.css('transform','rotate('+now+'deg)');
    if(delta < 80){
      delta = delta + 1;
    }
  }, 10)
}
function derotateWheel($elem){
  if(rotateInterval === undefined){
    return;
  }
  clearInterval(rotateInterval)
  var delta = 80;
  var now = getRotationDegrees($elem);
  var stop_flag = 200;
  derotateInterval = setInterval(function(){
    if(stop_flag <= 0){
      clearInterval(derotateInterval)
    }
    now = now - delta;
    $elem.css('-webkit-transform','rotate('+now+'deg)');
    $elem.css('-moz-transform','rotate('+now+'deg)');
    $elem.css('transform','rotate('+now+'deg)');
    if(delta > 1){
      delta = delta - 0.3;
    }else if(delta<=1){
      delta = 1;
      stop_flag -= 1;
    }
  }, 10)

}

function getRotationDegrees(obj) {
  var matrix = obj.css("-webkit-transform") ||
  obj.css("-moz-transform")    ||
  obj.css("-ms-transform")     ||
  obj.css("-o-transform")      ||
  obj.css("transform");
  if(matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
  } else { var angle = 0; }
  return (angle < 0) ? angle +=360 : angle;
}
var colorRecord = [
  // { id: 0, title: "紅色", value:  40, color: "#FF0000" },
  // { id: 1, title: "黃色", value:  40, color: "#FFFF00" },
  // { id: 2, title: "綠色", value:  40, color: "#00FF00" }
];
function toggleColor(color){
  var colorsInfo = {
    "red": { id: 0   , title: "紅色", value:  40, color: "#FF0000" },
    "yellow": { id: 1, title: "黃色", value:  40, color: "#FFFF00" },
    "green": { id: 2 , title: "綠色", value:  40, color: "#00FF00" },
    "blue": { id: 3  , title: "藍色", value:  40, color: "#0000FF" },
    "brown": { id: 4 , title: "咖啡色", value: 40, color: "#4D3900" },
    "black": { id: 5 , title: "黑色", value:  40, color: "#000000" },
    "white": { id: 6 , title: "白色", value:  40, color: "#FFFFFF" }
  }

  var target = colorsInfo[color];
  var is_finded = false;
  $.each(colorRecord, function(index, color){
    if(color.id === target.id){
      is_finded = true
      delete colorRecord.splice(index, 1);
      return false;
    }
  })
  if(is_finded){

  }else{
    colorRecord.push(target);
  }
  reloadWheel();
  markSelectedColors();
}
function resetColors(){
  colorRecord = [];
  reloadWheel();
  markSelectedColors();
}

function reloadWheel(){
  $("#doughnutChart").html("")
  $("#doughnutChart").drawDoughnutChart(colorRecord);
}
function markSelectedColors(){
  $('.AddColorBtn').removeClass('is_active');
  $.each(colorRecord, function(index, color){
    $('.AddColorBtn[data-id='+color.id+']').addClass('is_active');
  })
}

function saveForLater($recipe){
  console.log($recipe)
  var id = $recipe.attr('data-id');
  var image_url = $recipe.find('img').attr('src');
  var html = JST['recommendation/save_item']({image_url: image_url, id: id});
  $('#SaveRiver .River-wrapper').append(html);
}

function fixRiverSize(){
  var width =  ($('.River-recipe').length * ($('.River-recipe').width()+20 )) +"px";
  $('.River-wrapper').css('width', width);
}

$(function(){
  $("#doughnutChart").drawDoughnutChart(colorRecord);

  $("#reset-btn").click(function(){
    resetColors();
  });

  $("#suggestion-btn").click(function(){
    rotateWheel($("#doughnutChart").find('svg'));
  });

  $(document).on('click', '.AddColorBtn', function(){
    color = $(this).attr('data-color');
    toggleColor(color);
  });

  $(document).on('click', '.js-recipe-save', function(){
    $recipe = $(this).parents('.Recipe');
    saveForLater($recipe);
    fixRiverSize();
  });

  $(document).on('click', '.js-recipe-delete', function(){
    $recipe = $(this).parents('.River-recipe');
    $recipe.remove();
    fixRiverSize();
  });
});