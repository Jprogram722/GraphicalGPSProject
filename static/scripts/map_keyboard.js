/*
  This is the file for the simple keyboard
*/

const Keyboard = window.SimpleKeyboard.default;

const myKeyboard = new Keyboard({
  layout: {
    'default': [
      '1 2 3 4 5 6 7 8 9 0 {bksp}',
      'q w e r t y u i o p',
      'a s d f g h j k l',
      'z x c v b n m , .',
      '{lock} {space}'
    ],
    'lock': [
      '1 2 3 4 5 6 7 8 9 0 {bksp}',
      'Q W E R T Y U I O P',
      'A S D F G H J K L',
      'Z X C V B N M , .',
      'default {space}'
    ]
  },
  // onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button)
});

function onKeyPress(button) {

  const inputBox = document.querySelector("#location-save-name");

  if(button === "{lock}" || button === "{shift}"){
    myKeyboard.setOptions({
      layoutName: "lock"
    })
  }
  else if(button === "default"){
    myKeyboard.setOptions({
      layoutName: "default"
    })
  }
  else if(button === "{bksp}" && inputBox.value.length > 0){
    inputVal = inputBox.value
    stringArr = inputVal.split("");
    stringArr.pop();
    inputBox.value = stringArr.join("");
  }
  else if (button === "{bksp}" && inputBox.value.length === 0){
    
  }
  else if(button === "{space}"){
    inputBox.value += " ";
  }
  else{
    inputBox.value += button;
  }
  console.log("Button pressed", button);
}