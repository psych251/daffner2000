var prepractice_instruction = {
     type: "instructions",
     pages:[
         "Welcome to the practice phase!<p>In this practice phase, you will look at a group of pictures. Some pictures repeat, some do not. You can spend as long as you want on each picture. When you are done, press the down arrow to go to the next one.</p>",
         "You will also need to respond to the target picture. When you see the target picture, please press the space bar. The target picture for practice phase is shown below." + '<p><img src="'+ "images/practice/practice_target.jpg" + '"></img></p>',
         "We will not test you afterward.",
     ],
     show_clickable_nav: true
     
 }



var intertrial_interval = {
            type: 'html-keyboard-response',
            stimulus: '<img src=images/blank.png width ="500" height = "500" style="border:5px solid black">',
            trial_duration: function(){ 
                var random_duration = 800 + 500 * Math.random()
                return random_duration  } , //The interval between the offset of one stimulus and the onset of the next stimulus ranged between 800 and 1300 msec
            choices: jsPsych.NO_KEYS
        }

var practice_trial_a = {
            type: 'practice-block',
            stimulus: "<img src='"+"images/practice/practice_background.jpeg"+"' width ='500' height = '500' style='border:5px solid black'>",
            choices_for_target: [32],
            choices: [40],
            minimum_viewing_duration: 600, // daffner2000's info
            response_ends_trial: true, 
            task_target_stimulus:"images/practice/practice_target.jpg",
        }
var practice_trial_b = {
            type: 'practice-block',
            stimulus: "<img src='"+"images/practice/practice_background.jpeg"+"' width ='500' height = '500' style='border:5px solid black'>",
            choices_for_target: [32],
            choices: [40],
            minimum_viewing_duration: 600, // daffner2000's info
            response_ends_trial: true, 
            task_target_stimulus:"images/practice/practice_target.jpg",
        }
var practice_trial_deviant = {
            type: 'practice-block',
            stimulus: "<img src='"+"images/practice/practice_deviant.jpeg"+"' width ='500' height = '500' style='border:5px solid black'>",
            choices_for_target: [32],
            choices: [40],
            minimum_viewing_duration: 600, // daffner2000's info
            response_ends_trial: true, 
            task_target_stimulus:"images/practice/practice_target.jpg",
        }
var practice_trial_target = {
            type: 'practice-block',
            stimulus: "<img src='"+"images/practice/practice_target.jpg"+"' width ='500' height = '500' style='border:5px solid black'>",
            choices_for_target: [32],
            choices: [40],
            minimum_viewing_duration: 600, // daffner2000's info
            response_ends_trial: true, 
            task_target_stimulus:"images/practice/practice_target.jpg",
        }

        
    
var practice_trial_target_while_loop = {
    timeline: [practice_trial_target], 
        loop_function: function(){
            var data = jsPsych.data.get().last(1).values()[0];
            if(data.trial_pressed_space_bar == "yes"){
                
                return false;
            } else {
                return true;
        }}
   
}

    
var practice_trial_e = {
            type: 'practice-block',
            stimulus: "<img src='"+"images/practice/practice_background.jpeg"+"' width ='500' height = '500' style='border:5px solid black'>",
            choices_for_target: [32],
            choices: [40],
            minimum_viewing_duration: 600, // daffner2000's info
            response_ends_trial: true, 
            task_target_stimulus:"images/practice/practice_target.jpg",
        }



var postpractice_instruction = {
     type: 'task-instructions',
        pages: ["Great! Now that you have finished the practice trials, press the button below to get started!"],
        allow_backward: false, 
        show_clickable_nav: true,
        button_label_next: "Get Started",
        show_page_number: false
     
 }

var practice_block = [
    practice_trial_a,
    intertrial_interval,
    practice_trial_b,
    intertrial_interval,
    practice_trial_deviant,
    intertrial_interval,
    practice_trial_target_while_loop,
    intertrial_interval,
    practice_trial_e,
    postpractice_instruction
]




/*
var practice_block = {
    timeline: [
        
        {
            type: 'html-keyboard-response',
            stimulus: '<img src=images/blank.png width ="500" height = "500" style="border:5px solid black">',
            trial_duration: function(){ 
                var random_duration = 800 + 500 * Math.random()
                return random_duration  } , //The interval between the offset of one stimulus and the onset of the next stimulus ranged between 800 and 1300 msec
            choices: jsPsych.NO_KEYS
        },
        
        
       
        {
            type: 'practice-block',
            stimulus: function(){
                var html="<img src='"+jsPsych.timelineVariable('pic', true)+"' width ='500' height = '500' style='border:5px solid black'>";
                
                return html;
            },
            choices_for_target: [32],
            choices: [40],
            minimum_viewing_duration: 600, // daffner2000's info
            response_ends_trial: true, 
            task_target_stimulus:"images/practice/practice_target.jpg",

        }],
        
    timeline_variables: [
        {pic: "images/practice/practice_background.jpeg"},
        {pic: "images/practice/practice_background.jpeg"},
        {pic: "images/practice/practice_background.jpeg"},
        {pic: "images/practice/practice_deviant.jpeg"},
        {pic: "images/practice/practice_target.jpg"}
    ],
    randomize_order: true 
    
    
     
    }

*/
