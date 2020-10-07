/**
 * jspsych-html-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["stimulus-presentation"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'stimulus-presentation',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      choices_for_target:{
          type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The key the subjects supposed to press when seeing the target'
          
      },
        
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
        
      minimum_viewing_duration:{
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'minimum viewing time duration',
        default: 0,
        description: 'minimum time the participants need to look at the stimuli'
          
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
        
      task_type:{
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Task Type',
        default: null,
        description: 'All simple, all complex or mixed'  
      },
        
      task_target_stimulus:{
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Task Target Stimulus',
        default: null,
        description: 'The target stimulus the participants need to respond to in the current task.'  
      },
      task_background_stimulus:{
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Task Background Stimulus',
        default: null,
        description: 'The background stimulus the participants will see a lot in this task'  
      }, 
      task_deviant_stimulus:{
        type: jsPsych.plugins.parameterType.ARRAY, 
        pretty_name: "Task Deviant Stimulus",
        default: null, 
        description: "The deviant stimulus used in the current task" 
      },
      task_order_number:{
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Task Order',
        default: null,
        description: 'the order in which the current task appears on' 
      },
      block_order_number:{
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Block Order',
        default: null,
        description: 'the order in which the current block appears on'   
      }
      
          
    

    }
  }

  plugin.trial = function(display_element, trial) {

    var new_html = '<div id="jspsych-html-keyboard-response-stimulus">'+trial.stimulus+'</div>';

    // add prompt
    if(trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }
        
      // gather the stimulus trial type
        
      var trial_stimulus_type = ""  
      var deviant = trial.task_deviant_stimulus
      if (trial.stimulus.includes(trial.task_target_stimulus)){
          
          trial_stimulus_type = "target"
          
      }else if(trial.stimulus.includes(trial.task_background_stimulus)){
          
          trial_stimulus_type = "background"
          
      }else if (deviant.filter(function(item){
          return (trial.stimulus.includes(item))
      }).length === 1){
                    
          trial_stimulus_type = "deviant"
      }else{
          alert("stimulus selection in stimulus presentation! not belonging to any category!")
      }
        
      trial.trial_stimulus_type = trial_stimulus_type
        
        
      

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "trial_stimulus": trial.stimulus,
        "trial_stimulus_type": trial_stimulus_type,
        "key_press": response.key, 
        "task_type": trial.task_type, 
        "task_target_stimulus": trial.task_target_stimulus,
        "task_background_stimulus":trial.task_background_stimulus,
        "task_deviant_stimuli": trial.task_deviant_stimulus,
        "task_order_number": trial.task_order_number,
        "blcok_order_number": trial.block_order_number,
        "minimum_viewing_duration":trial.minimum_viewing_duration,
        "trial_looking_time": trial.minimum_viewing_duration + response.rt
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
   var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    if (trial.choices_for_target != jsPsych.NO_KEYS && trial.choices != jsPsych.NO_KEYS){
        
        var key_for_target = trial.choices_for_target.concat(trial.choices)
        
        // if it is the target trial 
         if(trial.stimulus.includes(trial.task_target_stimulus)){
             
             jsPsych.pluginAPI.setTimeout(function() {
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: key_for_target,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
             
      }, trial.minimum_viewing_duration)  
          
          
    // if it is the background OR the deviant      
      } else if (trial.stimulus.includes(trial.task_background_stimulus) || (trial.task_deviant_stimulus.filter(function(item){
          return (trial.stimulus.includes(item))
      }).length === 1)
      ){
          
          
          jsPsych.pluginAPI.setTimeout(function() {
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
             
      }, trial.minimum_viewing_duration)  
          
          
          
      } else{
          
          alert("error in target selection for keyboard responses!")
          
      }
        
        
        
        
        
        
    }  
      
    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
        
        
        
      
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();