/*
  This is the file for the simple keyboard
*/

const Keyboard = window.SimpleKeyboard.default;

const myKeyboard = new Keyboard({
  layout: {
    'default': [
      '1 2 3 4 5 6 7 8 9 0 {bksp}',
      'q w e r t y u i o p',
      '{lock} a s d f g h j k l {enter}',
      '{shift} z x c v b n m , .',
      '{space}'
    ],
    'lock': [
      '1 2 3 4 5 6 7 8 9 0 {bksp}',
      'Q W E R T Y U I O P',
      'default A S D F G H J K L {enter}',
      '{shift} Z X C V B N M , .',
      '{space}'
    ]
  },
  //onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button)
});

// function onChange(input) {
//   document.querySelector(".input").value = input;
//   console.log("Input changed", input);
// }

function onKeyPress(button) {
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
  else{

  }
  console.log("Button pressed", button);
}