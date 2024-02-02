let inputElement;
let userImage;
let filename = "none";

function fetchData(){
  const elements = document.querySelectorAll('.label-text');
  var clip_str = `\n"${filename}":[`;
  elements.forEach(element => {
  const startValue = element.getAttribute('start');
  const endValue = element.getAttribute('end');

  clip_str += `\n\t{"${element.textContent}":"${startValue},${endValue}"},`;
  });
  
  clip_str= clip_str.slice(0, -1);
  clip_str += "\n],";
  
  const textarea = document.getElementById('output');
  textarea.value = textarea.value + clip_str;
  
  window.alert("Saved");
}

function handleFile(file) {
  removeMarkers();
  filename = file.name;
  if (file.type === 'image') {
    userImage = createImg(file.data, '');
    userImage.hide();
  } else {
    userImage = null;
  }
}

function removeMarkers(){
  const elements1 = document.querySelectorAll('.label-text');
  const elements2 = document.querySelectorAll('.label-box');
  const elements3 = document.querySelectorAll('.marker-points');
  const elements4 = document.querySelectorAll('.button');
  elements1.forEach(element => {element.remove();});
  elements2.forEach(element => {element.remove();});
  elements3.forEach(element => {element.remove();});
  elements4.forEach(element => {element.remove();});

}

function downloadJSON() {
    const textarea = document.getElementById('output');
  //removing trailing comma
    const jsonData = "{\n" + textarea.value.slice(0,-1) + "\n}";

    const blob = new Blob([jsonData], { type: 'application/json' });

    const fileName = `output_${new Date().toISOString()}.json`;

    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

let cnv, img;
let image_changed = false;
let draw_active = false;
let start_point, end_point;
let p_start_point_square;

POINT_SIZE = 10;

var id_c = 0;

function preload() {
  userImage = loadImage('catalogue_sample.jpg');
  //img = createImage(66, 66);
}

function setup() {  
  
  inputElement = createFileInput(handleFile);
  inputElement.position();
  inputElement.class('file-input');
  
  //cnv = createCanvas(img.width, img.height);
  cnv = createCanvas(600,600);
  // let upload_btn = createButton('Choose image...');
  // upload_btn.position(1.1,1.1);
  let remove_btn = createButton('Remove all markers');
  remove_btn.mouseClicked(removeMarkers);
  remove_btn.position();
  let save_btn = createButton('Save');
  save_btn.mouseClicked(fetchData);
  save_btn.position();
  let export_btn = createButton('Export');
  export_btn.mouseClicked(function(){modal.style.display = "block";});
  export_btn.position();
}

function draw() {  
  if (userImage != null){
    resizeCanvas(userImage.width, userImage.height);
    image(userImage, 0, 0, userImage.width, userImage.height);
  }
  strokeWeight(1);
  stroke(255, 204, 0);
  fill(color('red'));
  strokeWeight(2);
  cnv.mouseClicked(function(){
    let start_point_square;
    let end_point_square;
    if(draw_active == false){
      start_point = [mouseX + POINT_SIZE/2, mouseY + POINT_SIZE/2];
      start_point_square = createDiv();
      start_point_square.id((id_c++).toString());
      start_point_square.class('marker-points');
      start_point_square.position(start_point[0],start_point[1]);
      p_start_point_square = start_point_square;
      
      draw_active = true;
    }else{
      end_point = [mouseX + POINT_SIZE/2, mouseY + POINT_SIZE/2];
      
      if(end_point[1] < start_point[1] || end_point[0]<start_point[0])
        return;
        
      end_point_square = createDiv();
      end_point_square.id((id_c++).toString());
      end_point_square.class('marker-points');
      end_point_square.position(end_point[0],end_point[1]);
    
      draw_active = false;
      
      //label box
      let label_box = createDiv();    
      label_box.position(start_point[0],start_point[1]);
      label_box.style('width', (end_point[0]-start_point[0]).toString() + 'px');
      label_box.style('height', (end_point[1]-start_point[1]).toString() + 'px');
      label_box.class('label-box');

      let labelText = createDiv('Name');
      labelText.attribute('contenteditable', 'true');
      labelText.attribute('start', start_point.toString());
      labelText.attribute('end', end_point.toString());
      labelText.class('label-text');
      labelText.position(start_point[0] + (end_point[0]-start_point[0])/2,start_point[1] + (end_point[1]-start_point[1])/2);
      
      let t_start_point_id = p_start_point_square.id();
      let t_end_point_id = end_point_square.id();
      
      let btn = createButton('Remove');
      btn.attribute('tabindex',"-1");
      btn.class('button');
      btn.position(start_point[0],start_point[1]);
      btn.mouseClicked(function(){
        document.getElementById(t_start_point_id).remove();
        document.getElementById(t_end_point_id).remove();
        label_box.remove();
        labelText.remove();
        btn.remove();
      })

    }
  });
}