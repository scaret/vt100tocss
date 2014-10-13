var VTClient = require('../..').VTClient;
var inputs = [
    "This is a plain Text",
    "\033[1;31mThis line should be red",
    "\033[0;31mThis line should be dark red",
    "\033[41mThis line should have dark red background",
    "\033[31;41mThis line's font color & background color should be the same, so you can't see it",
    "\033[0;1;31;43mMultiple\n\nLines",
    "\033[1;31mCo\033[1;32mlo\033[1;33mrf\033[1;34mul \033[1;35mLi\033[1;36mne\033[m"
];
var client = new VTClient();

for (var i = 0; i < inputs.length; i++){
    var output = client.parse(inputs[i]);
    console.log(inputs[i] + "\033[m");
    console.log(JSON.stringify(output, null, 4));
    console.log("-----------------------------")
}