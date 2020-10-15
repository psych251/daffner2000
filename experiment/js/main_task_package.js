
    
    
/*
    
console.log("new stimuli generation script")
console.log(test_new_simple)    

var counter = count_occurence(test_new_simple.blocks_info)
console.log(counter)
*/
    
var complex_test_blocks = create_all_stimuli_no_block(meta_stimuli_path = stimuli_tracker, 
                                     type = "all_complex", 
                                     n_trial = 10, 
                                     bkgd_freq = 0.7, 
                                     tg_freq = 0.15, 
                                     dvt_freq = 0.15)  
stimuli_tracker = complex_test_blocks.remaining_stimuli

    
var mixed_simple_test_blocks = create_all_stimuli_no_block(meta_stimuli_path = stimuli_tracker, 
                                     type = "mixed_simple_deviant", 
                                     n_trial = 10, 
                                     bkgd_freq = 0.7, 
                                     tg_freq = 0.15, 
                                     dvt_freq = 0.15)
stimuli_tracker = complex_test_blocks.remaining_stimuli

var mixed_complex_test_blocks = create_all_stimuli_no_block(meta_stimuli_path = stimuli_tracker, 
                                     type = "mixed_complex_deviant", 
                                     n_trial = 10, 
                                     bkgd_freq = 0.7, 
                                     tg_freq = 0.15, 
                                     dvt_freq = 0.15)

stimuli_tracker = complex_test_blocks.remaining_stimuli

// just double check there were no duplicates
var duplicate = check_duplicates([simple_test_blocks, complex_test_blocks, mixed_simple_test_blocks,mixed_complex_test_blocks])   
if (duplicate){
    alert("sampling script broken! detect duplicates!")
    assert()    
}

var ALL_TASKS = [simple_test_blocks,
                       complex_test_blocks, mixed_simple_test_blocks,mixed_complex_test_blocks]

shuffleArray(ALL_TASKS)