library(tidyverse)

tidy_data <- function(filtered_data, output_path){

  
  tidy_data <- filtered_data %>% 
    filter(trial_type == "stimulus-presentation") %>% 
    select(subject,  task_type, task_order_number, trial_stimulus_type, trial_stimulus, stimuli_type,
           trial_looking_time, trial_pressed_space_bar, trial_space_bar_rt, age, ethnicity, gender, education, no_press_prop, wrong_press_prop) %>% 
    mutate(
      block = task_type, 
      block_number = task_order_number, 
      trial_stimulus_complexity = stimuli_type, 
      trial_stimulus_path = gsub("<img src='", "", trial_stimulus), 
      trial_stimulus_path = gsub("' width ='500' height = '500' style='border:5px solid black'>", "", trial_stimulus_path), 
      demog_age = age, 
      demog_ethnicity = ethnicity, 
      demog_gender = gender, 
      demog_education = case_when(
        education == "Some high school" ~ 1,
        education == "High school diploma" ~ 2, 
        education == "Associate Degree/Technical certification" ~ 3, 
        education == "Bachelor's Degree" ~ 4, 
        education == "Master's Degree" ~ 5, 
        education == "Doctorate/Professional degree" ~ 6, 
        education == "Other" ~ NA_real_),
      target_no_press_percent = no_press_prop,
      non_target_press_percent = wrong_press_prop,
      trial_pressed_space_bar = if_else(is.na(trial_pressed_space_bar), "no", trial_pressed_space_bar)
    ) %>% 
    select(
      subject, block, block_number, 
      trial_stimulus_path, trial_stimulus_type, trial_stimulus_complexity, trial_looking_time, 
      trial_pressed_space_bar, trial_space_bar_rt, 
      demog_age, demog_ethnicity, demog_gender, demog_education
    )
  
  tidy_data$total_trial_num <- sequence(rle(tidy_data$subject)$lengths)
  tidy_data <- tidy_data %>% 
    mutate( 
      temp_id = paste0(subject, block_number) 
    )
  tidy_data$block_trial_num <- sequence(rle(tidy_data$temp_id)$lengths)
  
  tidy_data <- tidy_data %>% select(-temp_id)
  
  
   write_csv(tidy_data, output_path)
   return(tidy_data)
  
  
  
  
}