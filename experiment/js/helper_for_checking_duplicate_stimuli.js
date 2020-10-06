function get_all_stim(task_info){
    all_stimuli = []
    target = task_info.target
    background = task_info.background
    all_stimuli.push(target)
    all_stimuli.push(background)
    deviant = task_info.deviant
    all_stimuli = all_stimuli.concat(deviant)
    
    return (all_stimuli)
    
}    

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

function check_duplicates(block_array){
    
    all_blocks_stimuli = []
    for (var i = 0; i < block_array.length; i++){
        
        current_block_stimuli = get_all_stim(block_array[i])
        all_blocks_stimuli.push(current_block_stimuli)
        
        
    }
    
    return hasDuplicates(all_blocks_stimuli)
    
}

const findDuplicates = (arr) => {
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
  // JS by default uses a crappy string compare.
  // (we use slice to clone the array so the
  // original array won't be modified)
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}